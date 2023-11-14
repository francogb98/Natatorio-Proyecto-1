import { baseUrl } from "../url";

export const getUser = async (id) => {
  const response = await fetch(`${baseUrl}user/getinfoUser/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  return data;
};
