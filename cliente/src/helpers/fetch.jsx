import { baseUrl } from "./url";

//comentario
export const fetchUser = async ({ url, options }) => {
  try {
    const urlApi = `${baseUrl}user/` + url;

    const response = await fetch(urlApi, {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const fetchSinToken = async ({ endpoint, data, method = "GET" }) => {
  try {
    const url = `${baseUrl}user/${endpoint}`;

    if (method === "GET") {
      const resp = await fetch(url);
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    }
  } catch (error) {
    return error;
  }
};

export const fetchConTokenHours = async ({
  endpoint = "getAll",
  data,
  method = "GET",
}) => {
  try {
    const url = `${baseUrl}hour/${endpoint}`;
    const token = localStorage.getItem("token");

    if (method === "GET") {
      const resp = await fetch(url);

      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(data),
      });

      return await resp.json();
    }
  } catch (error) {
    return error;
  }
};
export const fetchConToken = async ({
  endpoint = "activity/getAll/",
  data,
  method = "GET",
}) => {
  try {
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem("token");

    if (method === "GET") {
      const resp = await fetch(url, {
        method: "GET",

        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
      });
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ id: data }),
      });
      return await resp.json();
    }
  } catch (error) {
    return error;
  }
};

export const getInfoUser = async () => {
  try {
    if (!localStorage.getItem("token")) return;
    const resp = await fetch(
      `${baseUrl}user/infoUser/${localStorage.getItem("token")}`
    );
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const resp = await fetch(`${baseUrl}user/getAllUsers`);
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
