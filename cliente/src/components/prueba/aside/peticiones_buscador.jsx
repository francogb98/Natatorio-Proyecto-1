import { useMutation, useQueryClient } from "react-query";
import { baseUrl } from "../../../helpers/url";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { toast } from "sonner";
import { UserFetchPrivado } from "../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";
import { PiletaFetch } from "../../../helpers/piletas/Pileta-Fetch";

const agregarUsuarioAlistaAutorizados = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}autorizado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

const autorizarUsuaRIO = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta/autorizar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

function peticiones_buscador() {
  const [userEncontardo, setUserEncontrado] = useState(false);

  const queryClient = useQueryClient();

  const buscarUsuario = useMutation(UserFetchPrivado.getUser, {
    onSuccess: (data) => {
      if (data.status == "success") {
        setUserEncontrado(true);
      }
    },
  });

  useEffect(() => {}, [userEncontardo]);

  const agregarUsuarioAListaAutorizado = useMutation({
    mutationFn: agregarUsuarioAlistaAutorizados,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
        queryClient.invalidateQueries("lista_autorizados");
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Error!",
          text: data.message,
          icon: "error",
        });
      }
    },
  });
  const agregarUsuario = useMutation({
    mutationFn: PiletaFetch.agregarUsuarioAlTurno,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario agregado");
      }
      if (data.status === "error") {
        toast.error(data.message);
      }
      queryClient.invalidateQueries("getUsrsByDate");
      queryClient.invalidateQueries("piletas");
    },
  });
  const autorizar = useMutation({
    mutationFn: autorizarUsuaRIO,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Usuario ya agregado",
          icon: "error",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      queryClient.invalidateQueries("piletas");
    },
  });

  return {
    userEncontardo,
    setUserEncontrado,
    buscarUsuario,
    agregarUsuarioAListaAutorizado,
    agregarUsuario,
    autorizar,
  };
}

export default peticiones_buscador;
