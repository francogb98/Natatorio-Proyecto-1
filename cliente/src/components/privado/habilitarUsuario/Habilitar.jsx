import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import TablaUsuarios from "./TablaUsuarios";

import { getUser } from "../../../helpers/getInfoUser";

//traigo todos los usuarios para habilitar

import { getUsuarios } from "../../../helpers/getUsers";

function Habilitar() {
  const { data, status, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });

  const getUserById = useMutation({
    mutationFn: getUser,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (status === "error") {
    return <div>Error al obtener los usuarios</div>;
  }

  if (data.length === 0) {
    return <div>No hay usuarios para habilitar</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <button
        onClick={refetch}
        className="btn btn-lg btn-warning mt-3 mb-3"
        style={{ width: "400px", margin: "auto", display: "block" }}
      >
        Recargar
      </button>

      {isRefetching ? (
        <div style={{ margin: "auto", display: "block", width: "fit-content" }}>
          <h3>Recargando...</h3>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "800px 1fr",
          padding: "50px",
          gap: "20px",
          marginTop: "-35px",
        }}
      >
        <TablaUsuarios
          data={data}
          getUserById={getUserById}
          refetch={refetch}
        />

        {getUserById.isLoading ? (
          <div
            style={{ margin: "auto", display: "block", width: "fit-content" }}
          >
            <h3>Cargando...</h3>
          </div>
        ) : null}
        {getUserById.data && getUserById.data.status === "success" ? (
          <div
            style={{
              background: "#ccc",
              padding: "15px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <h3>Usuario</h3>

            {getUserById.data && getUserById.data.status === "success" ? (
              <div>
                <p>
                  Nombre:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.nombre}
                  </span>
                </p>
                <p>
                  DNI:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.dni}
                  </span>
                </p>
                <p>
                  Edad:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.edad}
                  </span>
                </p>
                <p>
                  Correo:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.email}
                  </span>
                </p>
                <p>
                  Telefono:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.telefono}
                  </span>
                </p>

                <p>
                  TelefonoContacto:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.telefonoContacto}
                  </span>
                </p>

                {getUserById.data.user.nombreTutor ? (
                  <p>
                    Nombre Tutor:
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {" "}
                      {getUserById.data.user.nombreTutor}
                    </span>
                  </p>
                ) : null}

                {getUserById.data.user.activity[0] ? (
                  <>
                    <p>
                      Actividad:{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {getUserById.data.user.activity[0].name}
                      </span>
                    </p>
                    <p>
                      Dias:
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {" "}
                        {getUserById.data.user.activity[0].date.join("-")}
                      </span>
                    </p>
                    <p>
                      Horario:
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {" "}
                        {getUserById.data.user.activity[0].hourStart} -{" "}
                        {getUserById.data.user.activity[0].hourFinish}
                      </span>
                    </p>
                  </>
                ) : (
                  <p>Actividad: No se encuentra registrado en ninguna</p>
                )}
                <p>
                  Asistencia:{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {getUserById.data.user.asistencia !== "false"
                      ? getUserById.data.user.asistencia
                      : "No hay asistencia registrada"}
                  </span>
                </p>
              </div>
            ) : getUserById.data && getUserById.data.status === "error" ? (
              <h3>{getUserById.data.message}</h3>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Habilitar;
