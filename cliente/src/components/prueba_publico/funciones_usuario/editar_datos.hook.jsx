import React, { useContext } from "react";
import { baseUrl } from "../../../helpers/url";
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from "../../../context/AuthContext";

import { toast } from "sonner";
import { darDeBajaActividad } from "../../../helpers/usersFetch/darDeBajaActividad";

const editar_informacion = async (content) => {
  const { filtro, body } = content;

  try {
    const url = `${baseUrl}user/editar/${filtro}`;
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });
    const { data } = await resp.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateFile = async (data) => {
  const res = await fetch(`${baseUrl}user/upload`, {
    method: "PUT",
    headers: {
      "x-token": localStorage.getItem("token"),
      authorization: `${localStorage.getItem("token")}`,
    },
    body: data,
  });
  return res.json();
};

function editar_datos() {
  const { userRefetch } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const cargarArchivo = useMutation({
    mutationFn: updateFile,

    onSuccess: (data) => {
      toast.success("Informacion actualizada");
      userRefetch();
    },
    onError: () => {
      toast.error("Error en el servidor");
      userRefetch();
    },
  });

  const editar = useMutation({
    mutationFn: editar_informacion,

    onSuccess: (data) => {
      toast.success("Informacion actualizada");
      userRefetch();
    },
    onError: () => {
      toast.error("Error en el servidor");
      userRefetch();
    },
  });

  const darDeBaja = useMutation({
    mutationFn: darDeBajaActividad,
    onSuccess: (data) => {
      toast.success("Informacion actualizada");
      userRefetch();
    },
    onError: () => {
      toast.error("Error en el servidor");
      userRefetch();
    },
  });

  return { editar, cargarArchivo, darDeBaja };
}

export default editar_datos;
