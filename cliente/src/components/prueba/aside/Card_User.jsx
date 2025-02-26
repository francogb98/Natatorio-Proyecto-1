import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import peticiones_buscador from "./peticiones_buscador";
import { AuthContext } from "../../../context/AuthContext";

import { Toaster, toast } from "sonner";
import CreatePeticion from "../peticiones/CreatePeticion";
import ImagenUser from "./ImagenUser";

import avatar from "../../../assets/avatar.webp";

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

function Card_User({ user, setUserEncontrado }) {
  const { auth } = useContext(AuthContext);
  const [solicitar, setSolicitar] = useState(false);

  const handleSolicitar = () => {
    setSolicitar(!solicitar);
  };

  const { agregarUsuarioAListaAutorizado, agregarUsuario, autorizar } =
    peticiones_buscador();

  useEffect(() => {
    if (user.fechaCargaCertificadoHongos) {
      calcular_fecha(user.fechaCargaCertificadoHongos);
    }
  }, []);

  return (
    <>
      <div className="card px-2" style={{ width: "18rem", fontSize: "12px" }}>
        {!solicitar && (
          <div className="card-body">
            {/* poner boton de cerrar en la parte superior derecha */}
            <button
              type="button"
              className="btn-close d-block ms-auto"
              aria-label="Close"
              onClick={() => {
                setUserEncontrado(false);
              }}
            ></button>

            {/* imagen del usuario centrada y que no sea grande */}

            <ImagenUser foto={user.foto ? user.foto : avatar} />

            <h5 className="card-title fs-6 text-center">
              <Link
                to={`usuario/${user._id}`}
                onClick={() => {
                  setUserEncontrado(false);
                }}
              >
                {user.nombre.charAt(0).toUpperCase() + user.nombre.slice(1)}{" "}
                {user.apellido.charAt(0).toUpperCase() + user.apellido.slice(1)}
              </Link>
            </h5>
            <h6 className="card-subtitle mb-1 text-body-secondary fs-6 text-center">
              {user.customId}
            </h6>
            {!user.activity || !user.activity.length ? (
              <p className="card-text">No tiene actividad registrada</p>
            ) : (
              <>
                <p className={`card-text d-flex justify-content-between mb-1`}>
                  <b>
                    Certificado PyM:{" "}
                    <span>{user.fechaCargaCertificadoHongos}</span>
                  </b>{" "}
                  |{" "}
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

                {user.activity.map((activity) => (
                  <div key={activity._id} className="border mb-1 p-2">
                    <p className="card-text mb-1">
                      <b>
                        {activity.name.charAt(0).toUpperCase() +
                          activity.name.slice(1)}
                      </b>{" "}
                      |<b>{activity.hourStart}</b>-<b>{activity.hourFinish}</b>
                    </p>
                    <p className="card-text mb-1">
                      <b>{activity.date.join(" - ")}</b>
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
                    {user.status &&
                      (auth.role === "SUPER_ADMIN" ||
                        auth.role === "ADMINISTRATIVO") && (
                        <button
                          className="btn btn-sm btn-success ms-0 w-100"
                          onClick={() => {
                            toast.info("Agregando usuario");
                            agregarUsuario.mutate({
                              customId: user.customId,
                              nombre: user.nombre,
                              apellido: user.apellido,
                              actividad: activity.name,
                              pileta: activity.pileta,
                              horarioIngreso: activity.hourStart,
                              horarioSalida: activity.hourFinish,
                            });
                          }}
                        >
                          Agregar
                        </button>
                      )}
                  </div>
                ))}
              </>
            )}

            <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
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
              <button
                className="btn btn-sm btn-primary ms-1 me-1"
                onClick={handleSolicitar}
              >
                solicitar
              </button>
            </div>
          </div>
        )}
        {solicitar && (
          <CreatePeticion user={user} handleSolicitar={handleSolicitar} />
        )}
        <Toaster position="bottom-left" richColors />
      </div>
    </>
  );
}

export default Card_User;
