import React from "react";

import style from "./style.module.css";
import { HabilitarUsuario } from "../../../../helpers/usersFetch/HabilitarUsuario";
import { inhabilitarUsuario } from "../../../../helpers/usersFetch/inhabilitarUsuario";
import { useMutation, useQueryClient } from "react-query";

import Swal from "sweetalert2";
import { useState } from "react";
import { useEffect } from "react";

function FormularioHabilitarUsuario({ id }) {
  const [estado, setEstado] = useState(false);

  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");

  const queryClient = useQueryClient();

  const inhabilitar = useMutation({
    mutationFn: inhabilitarUsuario,

    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Usuario inhabilitado",
          showConfirmButton: false,
          timer: 1500,
        });

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
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

  const handleHabilitar = (e) => {
    e.preventDefault();
    habilitar.mutate({ id });
  };
  const handleInhabilitar = (e) => {
    e.preventDefault();

    const data = {
      id,
      asunto: asunto,
      cuerpo: cuerpo,
    };
    // console.log(data);
    inhabilitar.mutate(data);
  };

  useEffect(() => {}, [estado]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className={style.buttonGroup}>
        <button className="btn btn-success" onClick={handleHabilitar}>
          Habilitar
        </button>
        <button className="btn btn-warning" onClick={() => setEstado(!estado)}>
          Inhabilitar
        </button>
      </div>

      {estado && (
        <>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Asunto
            </label>
            <input
              type="text"
              name="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Mensaje para el usuario
            </label>
            <textarea
              type="text"
              name="cuerpo"
              placeholder="falta de datos; datos incorrecots; corregir numero de dni; cambiar foto; etc"
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>

          <button className={style.buttonEnviar} onClick={handleInhabilitar}>
            Enviar
          </button>
        </>
      )}
    </form>
  );
}

export default FormularioHabilitarUsuario;
