import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import peticiones_buscador from "./peticiones_buscador";
import { AuthContext } from "../../../context/AuthContext";

import { Toaster, toast } from "sonner";

function calcular_fecha(fecha_carga) {
  // Convertir la cadena de fecha en un objeto de fecha
  var partesFecha = fecha_carga.split("/");

  // Crear el objeto de fecha
  var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  // Obtener la fecha actual
  var fechaActual = new Date();

  fecha.setMonth(fecha.getMonth() + 1);

  // Calcular la diferencia en milisegundos
  var diferenciaMilisegundos = fechaActual - fecha;

  // Convertir la diferencia de milisegundos a días
  var diasPasados = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  return diasPasados;
}

function Card_User({ user, inasistencia }) {
  const { auth } = useContext(AuthContext);

  const {
    setUserEncontrado,
    agregarUsuarioAListaAutorizado,
    agregarUsuario,
    autorizar,
  } = peticiones_buscador();

  useEffect(() => {
    if (user.fechaCargaCertificadoHongos) {
      calcular_fecha(user.fechaCargaCertificadoHongos);
    }
  }, []);

  return (
    <>
      <div className="card px-2" style={{ width: "18rem", fontSize: "12px" }}>
        <div className="card-body">
          <h5 className="card-title fs-6">
            <Link
              to={`usuario/${user._id}`}
              onClick={() => {
                setUserEncontrado(false);
              }}
            >
              {user.nombre} {user.apellido}
            </Link>
          </h5>
          <h6 className="card-subtitle mb-1 text-body-secondary fs-6">
            {user.customId}
          </h6>
          {!user.activity || !user.activity.length ? (
            <p className="card-text">No tiene actividad registrada</p>
          ) : (
            <>
              <p className="card-text mb-1">
                <b>{user.activity[0].name}</b> |
                <b>{user.activity[0].hourStart}</b>-
                <b>{user.activity[0].hourFinish}</b>
              </p>
              <p className="card-text mb-1">
                <b>{user.activity[0].date.join(" - ")}</b>
              </p>
              <p
                className={`card-text mb-1 ${
                  user.status ? "text-success" : "text-danger"
                }`}
              >
                <b className="mb-1">
                  {user.status ? "Habilitado" : "Esperando Habilitacion"}
                </b>
              </p>
              <p className={`card-text mb-1`}>
                <b>
                  Inasistencias:{" "}
                  <span
                    className={`${
                      user.inasistencias.length < 4
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {inasistencia}
                  </span>
                </b>
              </p>
              <p className={`card-text d-flex justify-content-between mb-1`}>
                <b>
                  Certificado PyM:{" "}
                  <span>{user.fechaCargaCertificadoHongos}</span>
                </b>
                {user.fechaCargaCertificadoHongos && (
                  <>
                    <b
                      className={`${
                        calcular_fecha(user.fechaCargaCertificadoHongos) > 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {calcular_fecha(user.fechaCargaCertificadoHongos) > 0
                        ? `Pasaron ${Math.abs(
                            calcular_fecha(user.fechaCargaCertificadoHongos)
                          )} Dias`
                        : `Faltan ${Math.abs(
                            calcular_fecha(user.fechaCargaCertificadoHongos)
                          )} Dias`}
                    </b>
                  </>
                )}
              </p>
            </>
          )}

          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
            {user.status &&
              (auth.role === "SUPER_ADMIN" ||
                auth.role === "ADMINISTRATIVO") && (
                <button
                  className="btn btn-sm btn-success ms-0"
                  onClick={() => {
                    toast.info("Agregando usuario");
                    agregarUsuario.mutate({
                      customId: user.customId,
                      nombre: user.nombre,
                      actividad: user.activity[0].name,
                      pileta: user.activity[0].pileta,
                      horarioIngreso: user.activity[0].hourStart,
                      horarioSalida: user.activity[0].hourFinish,
                    });
                  }}
                >
                  Agregar
                </button>
              )}
            {auth.role === "SUPER_ADMIN" && (
              <>
                <button
                  className="btn btn-sm btn-warning ms-1 me-1"
                  onClick={() => {
                    autorizar.mutate({ id: user.customId });
                  }}
                >
                  Autorizar
                </button>
                <button
                  className="btn btn-sm btn-secondary ms-0"
                  style={{
                    fontSize: "13px",
                    paddingBlock: "5px",
                  }}
                  onClick={() => {
                    agregarUsuarioAListaAutorizado.mutate({
                      user: user._id,
                    });
                  }}
                >
                  Agregar a lista
                </button>
              </>
            )}
          </div>
        </div>
        <Toaster position="bottom-left" richColors />
      </div>
    </>
  );
}

export default Card_User;
