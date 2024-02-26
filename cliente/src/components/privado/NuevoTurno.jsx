import React from "react";
import swal from "sweetalert2";

import { useMutation, useQueryClient } from "react-query";

import { baseUrl } from "../../helpers/url";

const cambioTurno = async () => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

function NuevoTurno() {
  const queryClient = useQueryClient();

  const cambiarTurno = useMutation(cambioTurno, {
    onSuccess: (data) => {
      if (data.status === "ok") {
        swal.fire({
          title: "Turno cambiado",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        queryClient.invalidateQueries("getUsrsByDate");
        queryClient.invalidateQueries("piletas");
        queryClient.invalidateQueries("usuariosTurnoSiguiente");
      } else if (data.status === "error") {
        swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    onError: (data) => {
      swal.fire({
        title: "Error",
        text: data.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        className="btn btn-lg btn-danger mb-3 mt-2"
        style={{
          paddingTop: "15px",
          width: "40%",
        }}
        onClick={() => {
          cambiarTurno.mutate();
        }}
      >
        <h3>Inicar nuevo turno</h3>
      </button>
      {cambiarTurno.isLoading && (
        <div className="spinner-border text-primary mt-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
}

export default NuevoTurno;
