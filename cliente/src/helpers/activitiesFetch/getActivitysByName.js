import { baseUrl } from "../url";

export const getActivitysByName = async ({ activity }) => {
  "activity", activity;
  try {
    const url = `${baseUrl}activity/getActivityByName`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ activity }),
    });
    const { actividades } = await resp.json();
    return actividades;
  } catch (error) {
    return error;
  }
};
