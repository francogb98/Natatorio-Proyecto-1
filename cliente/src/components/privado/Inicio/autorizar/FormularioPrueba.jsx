import React from "react";

import useSocketPiletas from "../../../../hooks/useSocketPiletas.jsx.jsx";

import useDiaYHoraActual from "../../../../hooks/UseDay.jsx";

import style from "./style.module.css";

function FormularioPrueba() {
  const { horaActual, diaActualEnEspanol } = useDiaYHoraActual();
  const { socket, setCargando, cargando, error, success } = useSocketPiletas();

  const registrarUsuarioTurnoSiguiente = (e) => {
    e.preventDefault();
    setCargando(true);

    socket?.emit("autorizar", {
      id: e.target[0].value,
      horaSiguienteTurno: parseInt(horaActual) + 1 + ":00",
      dia: diaActualEnEspanol,
    });
  };

  return (
    <div className={style.formularioBody}>
      <h2>Autorizar Usuario</h2>
      <form onSubmit={(e) => registrarUsuarioTurnoSiguiente(e)}>
        <label
          htmlFor=""
          style={{
            textAlign: "start",
          }}
        >
          Escribe el numero de identificacion del usuario
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <button type="submit" className="btn btn-lg btn-success mt-4">
          Autorizar
        </button>
      </form>

      {cargando ? (
        <div className="alert alert-info mt-4" role="alert">
          <strong>Cargando...</strong>
        </div>
      ) : null}

      {error.error ? (
        <div className="alert alert-danger mt-4" role="alert">
          <strong>{error.msg}</strong>
        </div>
      ) : null}

      {success.success ? (
        <div className="alert alert-success mt-4" role="alert">
          <strong>{success.msg}</strong>
        </div>
      ) : null}
    </div>
  );
}

export default FormularioPrueba;
