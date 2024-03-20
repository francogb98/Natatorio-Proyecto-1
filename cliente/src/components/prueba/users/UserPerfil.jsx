import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../helpers/url";

import avatar from "../../../assets/avatar.webp";
import { AuthContext } from "../../../context/AuthContext";
import UserImages from "./habilitarUsuario/UserImages";

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
              {user.nombre} {user.apellido}
            </h2>
          </div>
        </div>

        <hr />

        <div className="row">
          {/* Actividades */}
          {user.activity?.length && (
            <div
              className="col-6 border-end"
              // style={{
              //   borderRight: "1px solid black",
              // }}
            >
              <h2 className="text-center">Actividad</h2>
              <p>Actividad: {user.activity[0].name}</p>
              <p>Dias: {user.activity[0].date.join(" - ")}</p>
              <p>
                Horario: {user.activity[0].hourStart} -{" "}
                {user.activity[0].hourFinish}{" "}
              </p>

              {!actividadesEspeciales.includes(user.activity[0].name) && (
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
              )}
            </div>
          )}
          {/* Datos */}
          <div className={user.activity?.length ? "col-6" : "col-12"}>
            <h2 className="text-center">Datos</h2>
            <p>Natacion Adaptada: {user.natacionAdaptada ? "Si" : "No"}</p>
            <p>Edad: {user.edad}</p>
            <p>Dni: {user.dni}</p>
            <p>Telefono: {user.telefono}</p>
            <p>Telefono de Emergencia: {user.telefonoContacto}</p>
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
                  <div key={notificacion._id}>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">{notificacion.asunto}</p>
                      <p
                        className={
                          notificacion.leido ? "text-success" : "text-warning"
                        }
                      >
                        {notificacion.leido ? "Leido" : "No Leido"}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {notificacion.cuerpo}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr />

        {auth.role == "SUPER_ADMIN" && (
          <div className="row mb-4 border">
            <h2 className="text-center ">Acciones Administrador</h2>
            <div className="col-6">
              <div className="mb-2">
                <button className="btn btn-sm btn-primary">
                  Enviar Notificacion
                </button>
              </div>
              <label className="fw-bold">Actividad:</label>
              <div className="d-flex justify-content-around mb-2">
                <button className="btn btn-sm btn-success">Habilitar</button>
                <button className="btn btn-sm btn-danger">Inhabilitar</button>
              </div>

              <div className="mb-3">
                <label className="fw-bold">Cambiar Rol:</label>
                <select
                  name=""
                  id=""
                  style={{ maxWidth: "100%" }}
                  // onChange={(e) => {
                  //   cambiar.mutate({
                  //     id: user._id,
                  //     role: e.target.value,
                  //   });
                  // }}
                  defaultValue={user.role}
                  className="form-select mb-2"
                >
                  <option value="SUPER_ADMIN">--Seleccionar Rol--</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                  <option value="GUARDAVIDA">GUARDAVIDA</option>
                  <option value="PROFESOR">PROFESOR</option>
                  <option value="usuario">usuario</option>
                </select>
              </div>

              <div className="d-flex mb-2">
                <button className="btn btn-sm btn-warning">
                  Agregar a una actividad
                </button>
              </div>
            </div>
            <div className="col-6"></div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPerfil;
