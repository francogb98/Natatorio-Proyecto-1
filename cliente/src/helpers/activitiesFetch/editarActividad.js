import { baseUrl } from "../url";

export const editarActividad = async (data) => {
  try {
    const url = `${baseUrl}activity/editarActividad`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    const body = await resp.json();
    return body;
  } catch (error) {
    return error;
  }
};
