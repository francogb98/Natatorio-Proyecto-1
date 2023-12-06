import { baseUrl } from "../url";

export const getAllUserForHour = async (hour) => {
  try {
    const resp = await fetch(baseUrl + `user/getAllUsers/${hour}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
