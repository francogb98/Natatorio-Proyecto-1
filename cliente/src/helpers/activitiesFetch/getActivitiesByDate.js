import { baseUrl } from "../url";

export const getActivitiesByDate = async (args) => {
  const res = await fetch(baseUrl + "activity/getActivitiesByDate", {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  const data = await res.json();
  return data;
};
