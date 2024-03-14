// authContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { generalRoutes } from "../utils/routes/general.routes.ts";

const BASE_URL = generalRoutes.BASE_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  cargando: boolean;
  userRole: string[] | null;
  login: (username: string, password: string) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => void;
  userInfo: User | null;
}

interface User {
  firstName?: string;
  lastName?: string;
  motherLastName?: string;
  documentType?: string;
  documentNumber?: string;
  contactNumber?: string;
  emergencyContactNumber?: string;
  address?: string;
  birthDate?: string;
  country?: string;
  username?: string;
  password?: string;
  role?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [cargando, setCargando] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string[] | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyToken(token)
        .then((isValid) => {
          if (isValid) {
            // get userInfo and set it
            getUserInfo(token);

            setIsAuthenticated(true);
            console.log("Autenticado correctamente");
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            console.log("El token no es valido");
          }
          // Establece cargando en false cuando haya terminado la verificación
          setCargando(false);
        })
        .catch((error) => {
          console.error("Error al verificar el token:", error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          // También establece cargando en false en caso de error
          setCargando(false);
        });

      // Verificar Rol
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const userRoles = tokenPayload.roles;
      // console.log("Roles del usuario:", userRoles);
      setUserRole(userRoles);
    } else {
      // Si no hay token, establece cargando en false también
      setCargando(false);
    }
  }, []);

  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/userInfo/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener la información del usuario");
      }
      setCargando(false);
      const userData = await response.json();
      setUserInfo(userData);
      return userData;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const userData = await response.json();

      if (userData.token) {
        localStorage.setItem("token", userData.token);

        // get userdata
        getUserInfo(userData.token);
        setUserInfo(userData);
        // Verificar Rol
        const tokenPayload = JSON.parse(atob(userData.token.split(".")[1]));
        const userRoles = tokenPayload.roles;
        // console.log("Roles del usuario:", userRoles);
        setUserRole(userRoles);

        setIsAuthenticated(true);
      } else {
        console.error("Token no encontrado en los datos de usuario");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (user: User) => {
    try {
      const response = await fetch(`${BASE_URL}/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const userData = await response.json();

      if (userData.token) {
        localStorage.setItem("token", userData.token);

        // get userdata
        getUserInfo(userData.token);
        setUserInfo(userData);

        // Verificar Rol
        const tokenPayload = JSON.parse(atob(userData.token.split(".")[1]));
        const userRoles = tokenPayload.roles;
        // console.log("Roles del usuario:", userRoles);
        setUserRole(userRoles);

        setIsAuthenticated(true);
      } else {
        console.error("Token no encontrado en los datos de usuario");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/verifyToken/${token}`);

      if (response.ok) {
        return true;
      } else {
        // Si el servidor responde con un estado no exitoso, lanzamos un error
        throw new Error(`Error al verificar el token: ${response.statusText}`);
      }
    } catch (error) {
      // Capturamos cualquier error de red u otros errores que puedan ocurrir
      console.error("Error al verificar el token:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        cargando,
        userRole,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
