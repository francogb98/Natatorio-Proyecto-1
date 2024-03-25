import { changeRol } from "../../../../helpers/usersFetch/cambiarRole";
import { useMutation, useQueryClient } from "react-query";
import { HabilitarUsuario } from "../../../../helpers/usersFetch/HabilitarUsuario";
import { inhabilitarUsuario } from "../../../../helpers/usersFetch/inhabilitarUsuario";
import { deleteNotificacion } from "../../../../helpers/usersFetch/notificaciones/deleteNotificacion";
import Swal from "sweetalert2";
import { baseUrl } from "../../../../helpers/url";

import { toast } from "sonner";

export const sendNotificacion = async (content) => {
  try {
    const response = await fetch(`${baseUrl}user/enviarNotificacion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(content),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const agregar_actividad = async (content) => {
  try {
    const response = await fetch(`${baseUrl}user/agregarUsuarioActividad`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(content),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const getActividades = async () => {
  try {
    const url = `${baseUrl}activity/getAll/`;
    const token = localStorage.getItem("token");
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: token,
      },
    });

    const respuesta = await resp.json();

    return respuesta.data;
  } catch (error) {
    return error;
  }
};
export const quitar = async ({ id }) => {
  try {
    const url = `${baseUrl}falta/${id}`;
    const token = localStorage.getItem("token");
    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authorization: token,
      },
    });

    const respuesta = await resp.json();

    return respuesta.data;
  } catch (error) {
    return error;
  }
};

function Funciones_administrador() {
  const queryClient = useQueryClient();

  const cambiar = useMutation({
    mutationFn: changeRol,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Cambiado de rol");

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        toast.error("Algo salio mal");
      }
    },
  });

  const inhabilitar = useMutation({
    mutationFn: inhabilitarUsuario,

    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Inhabilitado");
        quitar_lista.mutate({ id: data.data.user._id });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {},
  });

  const habilitar = useMutation({
    mutationFn: HabilitarUsuario,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Usuario habilitado",
          showConfirmButton: false,
          timer: 1500,
        });

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal",
        });
      }
    },
    onError: (error) => {},
  });

  const eliminarNotificacion = useMutation(deleteNotificacion, {
    onSuccess: () => {
      toast.success("notificacion eliminada");

      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");
    },
  });

  const enviarNotificacion = useMutation(sendNotificacion, {
    onSuccess: (data) => {
      if (data.status == "success") {
        toast.success("notificacion enviada");
      }
      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");
    },
  });

  const agregar_usuario_actividad = useMutation(agregar_actividad, {
    onSuccess: (data) => {
      if (data.status == "success") {
        toast.success("Usuario agregado a la actividad");
      }
      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");

      if (data.status == "error") {
        toast.error("Error al agregarusuario");
      }
    },
  });

  const quitar_lista = useMutation(quitar, {
    onSuccess: () => {
      toast.info("Usuario quitado de la lista");

      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");
    },
  });

  return {
    cambiar,
    inhabilitar,
    habilitar,
    eliminarNotificacion,
    enviarNotificacion,
    agregar_usuario_actividad,
    quitar_lista,
  };
}

export default Funciones_administrador;
