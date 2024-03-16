import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Badge, Button, Dropdown, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import LogoIcon from "../../assets/image/logo.png";
import { useAuth } from "../../context/AuthProvider";
import "./navbar.css";
import { useCart } from "../../context/CartProvider";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated, userInfo, cargando } = useAuth();
  const { products } = useCart();


  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    setIsLoggedIn(!!storedToken);
  }, []);

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada exitosamente");
    navigate("/");
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
  };

  const items: MenuProps["items"] = [
    {
      label: "Perfil",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => handleItemClick("/dashboard/profile"),
    },
    {
      label: "Cerrar Sesión",
      key: "2",
      icon: <IoIosLogOut />,
      danger: true,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleMouseEnter = () => {

  };

  if (cargando) return <Spin fullscreen />;

  return (
    <>
      <nav
        className={`fixed w-full top-0 bg-white z-50 shadow-md`}
        style={{ height: "65px" }}
      >
        <Toaster richColors />
        <div className="container flex justify-between items-center h-full">
          <Link to={"/"} className="flex items-center gap-x-4 cursor-pointer">
            <img src={LogoIcon} alt="DepoEventos" className="w-10" />
            <h2 className="text-lg font-semibold">
              Depo<span className="text-orange-500">Eventos</span>
            </h2>
          </Link>

          <ul className="flex gap-2">
            <li className="">
              <NavLink to="/">Inicio</NavLink>
            </li>

            <li className="">
              <NavLink to="/products">Productos</NavLink>
            </li>

            <li className="">
              <NavLink to="/team">Equipo</NavLink>
            </li>

            <li className="">
              <NavLink to="/contact">Contacto</NavLink>
            </li>

            <li className={`${isAuthenticated ? "block" : "hidden"}`}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>

          <ul className="flex items-center">
            {/* <button className="p-2 me-8">
              <FaShoppingCart className="text-2xl" />
            </button> */}
            {/* Carrito de compras */}
            <li className="">
              <Dropdown
                placement="bottomRight"
                overlay={
                  <div className="bg-white rounded-md px-4 py-2">
                    <table id="lista-carrito" className="u-full-width">
                      <thead>
                        <tr className="flex gap-12 leading-10">
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th></th>
                        </tr>
                      </thead>
                      <hr className="h-px" />
                      <tbody>
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={4}>No hay productos en el carrito</td>
                          </tr>
                        ) : (
                          products.map((product) => (
                            <tr key={product.id} className="flex gap-12 leading-10">
                              <td>{product.title}</td>
                              <td>${product.price}</td>
                              <td>1</td>
                              <td>
                                <button className="text-red-500">
                                  <i className="fas fa-times"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <button className="w-full text-neutral-400 border-neutral-300 border-[1px] rounded-md py-2 my-4">Vaciar Carrito</button>
                  </div>
                }
                className="border-none"
              >
                <Button className="me-4">
                  <Badge count={products.length}>
                    <Link to="/cart">
                      <FaShoppingCart className="text-2xl" />
                    </Link>
                  </Badge>
                </Button>
              </Dropdown>
            </li>

            {/* Autenticacion */}
            {isAuthenticated ? (
              <li className="">
                <Dropdown menu={menuProps} className="border-none">
                  <Button className="p-0">
                    <Space>
                      <Avatar size={30} icon={<UserOutlined />} />
                      {userInfo?.firstName + " " + userInfo?.lastName}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </li>
            ) : (
              <li className="">
                <Link to="/login" className="" style={{ padding: "10px 15px" }}>
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
