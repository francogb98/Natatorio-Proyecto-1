import { baseUrl } from "../url";

export const getPiletas = async () => {
  const url = `${baseUrl}pileta/getPiletas`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};
