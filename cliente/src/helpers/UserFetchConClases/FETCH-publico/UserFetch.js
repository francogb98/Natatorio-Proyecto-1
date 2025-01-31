import { baseUrl } from "../../url";

export class UserFetch {
  static login = async ({ endpoint, data, method = "GET" }) => {
    try {
      const url = `${baseUrl}user/${endpoint}`;

      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    } catch (error) {
      return error;
    }
  };

  static register = async ({ endpoint, data, method = "GET" }) => {
    try {
      const url = `${baseUrl}user/${endpoint}`;

      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    } catch (error) {
      return error;
    }
  };

  /**RECUPERAR CONTRASEÑA */
  static comprobarDatos = async (data) => {
    try {
      const url = `${baseUrl}user/comprobar-datos`;
      const body = {
        dni: data.dni,
        telefono: data.telefono,
      };
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const datos = await resp.json();
      return datos;
    } catch (error) {
      return error;
    }
  };

  static modificarContraseña = async (data) => {
    try {
      const url = `${baseUrl}user/modificar-password`;
      const body = {
        dni: data.dni,
        password: data.password,
      };
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const datos = await resp.json();
      return datos;
    } catch (error) {
      return error;
    }
  };

  static getInfoUser = async () => {
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

  /**CARGAR ARCHIVOS */

  static updateFile = async (data) => {
    try {
      const res = await fetch(`${baseUrl}user/upload`, {
        method: "PUT",
        headers: {
          "x-token": localStorage.getItem("token"),
          authorization: `${localStorage.getItem("token")}`,
        },
        body: data,
      });
      return res.json();
    } catch (error) {
      return false;
    }
  };

  /**REGISTRO DE ACTIVIDADES DE USUARIO */

  static registrarUsuarioEnActividad = async ({ idActividad, userId }) => {
    try {
      const response = await fetch(
        `${baseUrl}user/resgisterActivity/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ idActividad }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };
  static getActividadesUsuario = async () => {
    try {
      const url = `${baseUrl}activity/getActividadesNombre`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
      });
      const { actividades } = await resp.json();

      return actividades;
    } catch (error) {
      return error;
    }
  };

  /**EDITAR PERFIL */
  static editar_informacion = async (content) => {
    const { body } = content;

    {
      console.log(body);
    }

    try {
      const url = `${baseUrl}user/editarUsuario`;
      const resp = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();

      return data;
    } catch (error) {
      return error;
    }
  };

  static darDeBajaActividad = async (idActividad) => {
    try {
      const response = await fetch(`${baseUrl}user/darDeBajaActividad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          idActividad,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  /**Actualizar notificacion */
  static updateNotificacion = async ({ idNotificacion, userId }) => {
    try {
      const url = `${baseUrl}user/notificaciones/update/${userId}`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ idNotificacion }),
      });

      const data = await resp.json();

      return data;
    } catch (error) {
      return error;
    }
  };
}
