import { baseUrl } from "../url";

export const updateStadistic = async (args) => {
  try {
    const { id, usersQuantity } = args;
    const res = await fetch(baseUrl + "activity/updateStadistics/" + id, {
      method: "POST",
      body: JSON.stringify({ usersQuantity }),
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
