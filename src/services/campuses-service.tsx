import { generalRoutes } from "../utils/routes/general.routes";

const BASE_URL = generalRoutes.BASE_URL;

type campusType = {
  name?: string;
  description?: string;
  imagen?: string;
};
export const createCampus = async (form: campusType) => {
  try {
    await fetch(`${BASE_URL}/api/campuses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });
    
  } catch (error) {
    console.error("Error al crear una sede:", error);
    throw error;
  }
};

export const getAllCampuses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/campuses`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();

    console.log("Sedes obtenidas:", data);

    const dataWithKeys = data.map((item: any, index: any) => ({
      ...item,
      key: index,
    }));

    return dataWithKeys;
  } catch (error) {
    console.error("Error al obtener datos de sedes:", error);
    throw error;
  }
};