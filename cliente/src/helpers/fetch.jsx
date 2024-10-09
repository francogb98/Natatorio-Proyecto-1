import { baseUrl } from "./url";

//comentario

export const fetchConTokenHours = async ({
  endpoint = "getAll",
  data,
  method = "GET",
}) => {
  try {
    const url = `${baseUrl}hour/${endpoint}`;
    const token = localStorage.getItem("token");

    if (method === "GET") {
      const resp = await fetch(url);

      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(data),
      });

      return await resp.json();
    }
  } catch (error) {
    return error;
  }
};

export const getInfoUser = async () => {
  try {
    if (!localStorage.getItem("token")) return;
    const resp = await fetch(
      `${baseUrl}user/infoUser/${localStorage.getItem("token")}`
    );
    const data = await resp.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const resp = await fetch(`${baseUrl}user/getAllUsers`);
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
