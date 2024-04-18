import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Form, useParams } from "react-router-dom";
import { baseUrl } from "../../../../helpers/url";

import avatar from "../../../../assets/avatar.webp";
import { AuthContext } from "../../../../context/AuthContext";
import UserImages from "../utilidades/UserImages";
import Acciones_administrador from "./Acciones_administrador";
import Funciones_administrador from "../hooks/Funciones_administrador";
import { Toaster, toast } from "sonner";

export const getUser = async (id) => {
  try {
    const response = await fetch(`${baseUrl}user/getinfoUser/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

const actividadesEspeciales = [
  "equipo de natacion mdc",
  "equipo de natacion artistica",
  "equipo e.n.m.b",
  "equipo de natacion masters",
];

function UserPerfil() {
  const { auth } = useContext(AuthContext);

  const [imagen, setImagen] = useState(null);
  const [view, setView] = useState(false);

  const { id } = useParams();

  const { eliminarNotificacion } = Funciones_administrador();

  const { data, isSuccess, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getUserData"],
    queryFn: () => getUser(id),
  });

  useEffect(() => {
    refetch();
  }, [id]);

  useEffect(() => {}, [view, imagen]);

  if (!data /*|| isRefetching*/) {
    return <h1 className="text-center">Cargando...</h1>;
  }

  if (data.status == "success") {
    const { user } = data;

    return (
      <div className="container">
        <div className="row justify-content-center text-center">
          <img
            src={user.foto ?? avatar}
            alt=""
            style={{
              height: "200px",
              width: "200px",
            }}
            className="col-12"
          />
          <div className="col-12 mt-2">
            <h2>
              {user.nombre.charAt(0).toUpperCase() + user.nombre.slice(1)}{" "}
              {user.apellido.charAt(0).toUpperCase() + user.apellido.slice(1)}
            </h2>
            <h4>{user.customId}</h4>
          </div>
        </div>

        <hr />

        <div className="row">
          {/* Actividades */}
          <div
            className="col-6 border-end"
            // style={{
            //   borderRight: "1px solid black",
            // }}
          >
            {user.activity?.length &&
              user.activity.map((activity) => (
                <div key={activity._id} className="mb-3 text-center border p-2">
                  <h3>
                    {activity.name.charAt(0).toUpperCase() +
                      activity.name.slice(1)}
                  </h3>

                  <p>
                    <b>Dias:</b>
                    {activity.date.join(" - ")}
                  </p>
                  <p>
                    <b>Horario:</b>
                    {activity.hourStart} - {activity.hourFinish}{" "}
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

                  {/* <div className="d-flex justify-content-around">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        habilitar.mutate({
                          id: user._id,
                          activityId: activity._id,
                        });
                      }}
                    >
                      Habilitar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setAccion("inhabilitar");
                        setEjecutarAccion(true);
                      }}
                    >
                      Inhabilitar
                    </button>
                  </div> */}

                  {/* {!actividadesEspeciales.includes(activity.name) && (
                    <>
                      <p>
                        Inasistencias:{" "}
                        {user.inasistencias.length
                          ? user.inasistencias.join(" - ")
                          : "No tiene"}
                      </p>
                      <p>
                        Total:{" "}
                        {user.inasistencias.length
                          ? user.inasistencias.length
                          : "No tiene"}
                      </p>
                    </>
                  )} */}
                </div>
              ))}
          </div>
          {/* Datos */}
          <div className={user.activity?.length ? "col-6" : "col-12"}>
            <h2 className="text-center">Datos</h2>
            <p>Natacion Adaptada: {user.natacionAdaptada ? "Si" : "No"}</p>
            <p>Edad: {user.edad}</p>
            <p>Dni: {user.dni}</p>
            <p>Telefono: {user.telefono}</p>
            <p>Telefono de Emergencia: {user.telefonoContacto}</p>
            <p>Rol: {user.role}</p>
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          {/* Archivos */}

          <div
            className="col-6 border-end"
            // style={{
            //   borderRight: "1px solid black",
            // }}
          >
            <h2 className="text-center">Archivos</h2>
            <p>
              Ficha Medica:{" "}
              {user.fichaMedica ? (
                <span
                  onClick={() => {
                    setView(true);
                    setImagen(user.fichaMedica);
                  }}
                  style={{
                    cursor: "pointer",

                    color: "blue",
                  }}
                >
                  Abrir
                </span>
              ) : (
                "Falta Cargar"
              )}
            </p>
            <p>
              Foto DNI:{" "}
              {user.fotoDocumento ? (
                <span
                  onClick={() => {
                    setView(true);
                    setImagen(user.fotoDocumento);
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Abrir
                </span>
              ) : (
                "Falta Cargar"
              )}
            </p>
            <p>
              Certificado PyM:{" "}
              {user.certificadoHongos ? (
                <span
                  onClick={() => {
                    setView(true);
                    setImagen(user.certificadoHongos);
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Abrir
                </span>
              ) : (
                "Falta Cargar"
              )}
            </p>
            <p>Fecha de Carga: {user.fechaCargaCertificadoHongos}</p>
          </div>
          {view && (
            <UserImages
              imagen={imagen}
              setView={setView}
              setImagen={setImagen}
            />
          )}
          {/* Notificaciones */}

          <div className="col-6 overflow-scroll" style={{ maxHeight: "280px" }}>
            <h2 className="text-center">Notificaciones</h2>
            {user.notificaciones.length == 0 ? (
              <div>No tiene</div>
            ) : (
              <div>
                {user.notificaciones.map((notificacion) => (
                  <div key={notificacion._id} className="border-bottom py-2">
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">{notificacion.asunto}</p>

                      <button
                        className="btn py-0 px-1"
                        style={{
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        onClick={() => {
                          toast.info("notificacion eliminada");

                          eliminarNotificacion.mutate({
                            idNotificacion: notificacion._id,
                            idUsuario: user._id,
                          });
                        }}
                      >
                        <i
                          className="bi bi-trash3"
                          style={{
                            fontSize: "13px",
                          }}
                        ></i>
                      </button>
                    </div>

                    <p
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {notificacion.cuerpo}
                    </p>
                    <div className="d-flex justify-content-between">
                      <small>{notificacion.fecha ?? null}</small>
                      <p
                        className={
                          notificacion.leido ? "text-success" : "text-warning"
                        }
                      >
                        {notificacion.leido ? "Leido" : "No Leido"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Toaster position="bottom-left" richColors />
        <hr />

        {auth.role == "SUPER_ADMIN" && <Acciones_administrador user={user} />}
      </div>
    );
  }
}

export default UserPerfil;
