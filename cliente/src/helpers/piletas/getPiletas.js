import { baseUrl } from "../url";

export const getPiletas = async () => {
  try {
    const url = `${baseUrl}pileta/getAll`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
