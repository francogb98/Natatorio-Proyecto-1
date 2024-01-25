import { baseUrl } from "./url";

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
