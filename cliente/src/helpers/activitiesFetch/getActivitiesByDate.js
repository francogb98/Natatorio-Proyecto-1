import { baseUrl } from "../url";

export const getActivitiesByDate = async () => {
  const res = await fetch(baseUrl + "activity/getActividadesPorHora", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  const data = await res.json();
  return data;
};
