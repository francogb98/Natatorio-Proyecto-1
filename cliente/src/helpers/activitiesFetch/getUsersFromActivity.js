import { baseUrl } from "../url";

export default async function getUsersFromActivity() {
  try {
    const url = `${baseUrl}activity/getUsersFromActivity`;
    const token = localStorage.getItem("token");

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    return error;
  }
}
