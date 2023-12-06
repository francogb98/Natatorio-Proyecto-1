import { baseUrl } from "./url";

export const fetchHours = async () => {
  try {
    const res = await fetch(baseUrl + "hour/getAll");
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
export const postActivity = async (args) => {
  try {
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
  } catch (error) {
    return error;
  }
};
