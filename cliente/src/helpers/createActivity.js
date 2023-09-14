import { baseUrl } from "./url";

export const fetchHours = async () => {
  const res = await fetch(baseUrl + "hour/getAll");
  const data = await res.json();
  return data;
};
export const postActivity = async (args) => {
  const res = await fetch(baseUrl + "activity/createActivity", {
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
