import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../helpers/url";

import avatar from "../../../assets/avatar.webp";

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
  const { id } = useParams();

  const { data, isSuccess, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getUserData"],
    queryFn: () => getUser(id),
  });

  useEffect(() => {
    refetch();
  }, [id]);

  if (!data || isRefetching) {
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
            <p>Ficha Medica: {user.fichaMedica ? "Abrir" : "Falta Cargar"}</p>
            <p>Foto DNI: {user.dni ? "Abrir" : "Falta Cargar"}</p>
            <p>
              Certificado PyM:{" "}
              {user.certificadoHongos ? "Abrir" : "Falta Cargar"}
            </p>
            <p>Fecha de Carga: {user.fechaCargaCertificadoHongos}</p>
          </div>

          {/* Notificaciones */}

          <div className="col-6">
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
      </div>
    );
  }
}

export default UserPerfil;