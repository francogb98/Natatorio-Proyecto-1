import { baseUrl } from "./url";
//comentario para que se renderice el depñoy
const getAllPiletas = async () => {
  try {
    const response = await fetch(`${baseUrl}pileta/getAll`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
export default getAllPiletas;
