/// un fetch a /pileta/getAll

import { baseUrl } from "./url";

const getAllPiletas = async () => {
  const response = await fetch(`${baseUrl}pileta/getAll`);
  const data = await response.json();
  return data;
};
export default getAllPiletas;
