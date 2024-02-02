import { baseUrl } from "../url";

export const autorizar = async (id) => {
  try {
    const resp = await fetch(`${baseUrl}pileta/autorizar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(id),
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    return false;
  }
};
