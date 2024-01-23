import { baseUrl } from "../url";

export const getActivitiesByDate = async () => {
  try {
    const res = await fetch(baseUrl + "activity/getActividadesPorHora", {
      method: "GET",
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
export const getActivitiesByDateNextTurn = async () => {
  try {
    const res = await fetch(
      baseUrl + "activity/getActividadesPorHoraNextTurn",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
