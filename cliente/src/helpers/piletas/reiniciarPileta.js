import { baseUrl } from "../url";

export const reinicarPileta = async (pileta) => {
  console.log(pileta);
  const url = `${baseUrl}pileta/restart`;
  const token = localStorage.getItem("token") || "";

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "x-token": token,
      authorization: token,
    },
    body: JSON.stringify({ pileta }),
  });
  const data = await resp.json();
  return data;
};
