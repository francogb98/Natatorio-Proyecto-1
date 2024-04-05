import { baseUrl } from "../../../helpers/url";

export const info_tablas = async () => {
  try {
    const res = await fetch(`${baseUrl}pileta`);
    const data = await res.json();
    return data;
  } catch (error) {}
};
