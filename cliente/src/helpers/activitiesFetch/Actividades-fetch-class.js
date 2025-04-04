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
  static getActivitiesSinToken = async () => {
    try {
      const url = `${baseUrl}activity/getAll`;
      const resp = await fetch(url, {
        method: "GET",

        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await resp.json();

      return data;
    } catch (error) {
      return error;
    }
  };

  static getActivitiesById = async (id) => {
    try {
      const url = `${baseUrl}activity/getActividad/${id}`;
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
