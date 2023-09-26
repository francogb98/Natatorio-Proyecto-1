import { baseUrl } from "./url";

export const getUserByName = async (name) => {
  try {
    const res = await fetch(`${baseUrl}user/searchUserByName/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
