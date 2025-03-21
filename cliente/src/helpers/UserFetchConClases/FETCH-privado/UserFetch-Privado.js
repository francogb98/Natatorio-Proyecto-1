import { baseUrl } from "../../url";

export class UserFetchPrivado {
  static getUser = async (filtro) => {
    let url;
    if (isNaN(filtro[0])) {
      url = `user/findUserByLastName/${filtro}`;
    } else if (isNaN(filtro)) {
      url = `user/getinfoUser/_id/${filtro}`;
    } else {
      url = `user/getinfoUser/customId/${filtro}`;
    }

    const res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    return data;
  };

  static getUserById = async ({ id }) => {
    {
      const res = await fetch(`${baseUrl}user/getinfoUser/customId/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      return data;
    }
  };

  //Notificaciones usuario

  static sendNotificacion = async (content) => {
    try {
      const response = await fetch(
        `${baseUrl}user/enviarNotificacion/${content.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(content),
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return error;
    }
  };

  static deleteNotificacion = async ({ idNotificacion, id }) => {
    try {
      const url = `${baseUrl}user/notificaciones/delete/${id}`;
      const token = localStorage.getItem("token") || "";

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ idNotificacion }),
      });

      const respuesta = await resp.json();

      return respuesta;
    } catch (error) {
      return error;
    }
  };

  //Agregar usuario a una actibidad desde perfil
  static agregar_actividad = async ({ idActividad, id }) => {
    try {
      const response = await fetch(
        `${baseUrl}user/agregarUsuarioActividad/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
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

  //CAMBIAR ROL
  static changeRol = async ({ role, id }) => {
    try {
      const resp = await fetch(baseUrl + `user/cambiarRole/${role}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  //inhabilitar user
  static inhabilitarUsuario = async ({ activityId, id }) => {
    try {
      const url = `${baseUrl}user/deshabilitar/${id}`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ activityId }),
      });

      const body = await resp.json();

      return body;
    } catch (error) {
      return error;
    }
  };
}
