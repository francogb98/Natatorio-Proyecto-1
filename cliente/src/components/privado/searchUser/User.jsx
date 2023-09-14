import React from "react";

import style from "./style.module.css";

import avatar from "../../../helpers/avatar.webp";

function User({ user }) {
  const [show, setShow] = React.useState(false);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={user.foto == undefined || user.foto ? avatar : user.foto}
        alt=""
        style={{ width: "100px" }}
      />

      <h2>Nombre: {user.nombre}</h2>
      <h2>Correo: {user.email}</h2>

      <p>
        <span>DNI:</span>
        {user.dni}
      </p>
      <h3 style={{ color: "blue" }}>
        <span style={{ color: "red" }}>ID Usuario:</span>
        {user.customId}
      </h3>

      {user.activity === null ? (
        user.activity == undefined ? (
          <p>No estas inscripto a ninguna actividad</p>
        ) : !user.status ? (
          <p
            className="alert alert-danger fw-bold"
            style={{ width: "fit-content" }}
          >
            Esperando confirmacion de inscripcion
          </p>
        ) : (
          <>
            <p>
              <span> Actividad:</span>
              {user.activity[0].name}
            </p>
            <p>
              <span>Horario Ingreso:</span>
              {user.activity[0].hourStart}
            </p>
            <p>
              <span>Horario Salida:</span>
              {user.activity[0].hourFinish}
            </p>
            <p>
              <span>Dias : </span>
              {user.activity[0].date.join(" - ")}
            </p>
          </>
        )
      ) : (
        <>
          <div>
            <span> Actividad:</span>
            <p>No hay actividades registradas</p>
          </div>
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {user.fichaMedica == undefined ? (
          <p>No has cargado tu ficha medica</p>
        ) : (
          <button
            onClick={() => setShow(!show)}
            className="btn btn-success"
            style={{ width: "fit-content" }}
          >
            {show ? "Ocultar ficha" : "Ver ficha"}
          </button>
        )}
        {show ? (
          <img
            src={user.fichaMedica}
            alt=""
            style={{ height: "700px", width: "400px" }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default User;
