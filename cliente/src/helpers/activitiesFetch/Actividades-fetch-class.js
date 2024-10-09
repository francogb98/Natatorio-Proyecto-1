import { baseUrl } from "../url";

export class ActividadesFetch {
  static getActivities = async () => {
    try {
      const url = `${baseUrl}activity/getAll`;
      const token = localStorage.getItem("token");
      const resp = await fetch(url, {
        method: "GET",

        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
      });

      const data = await resp.json();

      return data;
    } catch (error) {
      return error;
    }
  };
}
