import { useMutation, useQueryClient } from "react-query";
import { HabilitarUsuario } from "../../../../helpers/usersFetch/HabilitarUsuario";
import Swal from "sweetalert2";
import { baseUrl } from "../../../../helpers/url";

import { toast } from "sonner";
import { UserFetchPrivado } from "../../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";

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

    return respuesta;
  } catch (error) {
    return error;
  }
};

function Funciones_administrador() {
  const queryClient = useQueryClient();

  const cambiar = useMutation({
    mutationFn: UserFetchPrivado.changeRol,
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
    mutationFn: UserFetchPrivado.inhabilitarUsuario,

    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Inhabilitado");
        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      return false;
    },
  });

  const habilitar = useMutation({
    mutationFn: HabilitarUsuario,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario habilitado");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal",
        });
      }
    },
    onError: () => {
      return false;
    },
  });

  //listo
  const eliminarNotificacion = useMutation(
    UserFetchPrivado.deleteNotificacion,
    {
      onSuccess: () => {
        toast.success("notificacion eliminada");

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      },
    }
  );

  //Listo
  const enviarNotificacion = useMutation(UserFetchPrivado.sendNotificacion, {
    onSuccess: (data) => {
      if (data.status == "success") {
        toast.success("notificacion enviada");
      }
      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");
    },
  });

  //Listo
  const agregar_usuario_actividad = useMutation(
    UserFetchPrivado.agregar_actividad,
    {
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
    }
  );

  return {
    cambiar,
    inhabilitar,
    habilitar,
    eliminarNotificacion,
    enviarNotificacion,
    agregar_usuario_actividad,
  };
}

export default Funciones_administrador;
