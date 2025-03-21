import { baseUrl } from "../../../../../helpers/url";

export class Hours {
  static async getHours() {
    try {
      const url = `${baseUrl}hour/getAll`;
      const resp = await fetch(url);
      const { data } = await resp.json();

      return data;
    } catch (error) {
      return error;
    }
  }
}
