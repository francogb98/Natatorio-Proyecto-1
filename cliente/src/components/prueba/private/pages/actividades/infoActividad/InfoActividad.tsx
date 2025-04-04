import {
  Activity,
  Stadistic,
} from "../../../../../../components/prueba/models";
import { ActividadesFetch } from "../../../../../../helpers/activitiesFetch/Actividades-fetch-class";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Tabla from "./Tabla";
import StadisticsTable from "./StadisticTabel";
import { AuthContext } from "../../../../../../context/AuthContext";

function InfoActividad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const actividadFetch = useQuery({
    queryKey: ["actividad", id],
    queryFn: () => ActividadesFetch.getActivitiesById(id as string),
  });

  if (actividadFetch.isLoading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-2">Cargando actividad...</span>
      </div>
    );

  if (actividadFetch.isSuccess && actividadFetch.data == null) {
    return (
      <div className="alert alert-warning my-4">
        No se encontró la actividad solicitada
      </div>
    );
  }

  if (actividadFetch.isError)
    return (
      <div className="alert alert-danger my-4">
        Error al cargar la actividad. Intente nuevamente más tarde.
      </div>
    );

  if (actividadFetch.isSuccess && actividadFetch.data) {
    const actividad: Activity = actividadFetch.data.actividad;
    const estadistica: Stadistic[] = actividadFetch.data.estadistica || [];
    return (
      <div className="container py-4">
        {/* Header con botón de volver */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a actividades
          </button>
          <h2 className="mb-0 text-center flex-grow-1">{actividad.name}</h2>
          <div style={{ width: "120px" }}></div> {/* Espaciador para alinear */}
        </div>
        {/* Información de la actividad */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Información de la actividad</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Pileta:</strong> {actividad.pileta}
                </p>
                <p>
                  <strong>Horario:</strong> {actividad.hourStart} -{" "}
                  {actividad.hourFinish}
                </p>
                <p>
                  <strong>Días:</strong> {actividad.date.join(", ")}
                </p>
                {auth?.role === "SUPER_ADMIN" && (
                  <p>
                    <strong>Codigo de Acceso:</strong>
                    <span
                      className={`badge ${
                        actividad.codigoDeAcceso ? "bg-success" : "bg-secondary"
                      } ms-2`}
                    >
                      {actividad.codigoDeAcceso
                        ? actividad.codigoDeAcceso
                        : "No tiene"}
                    </span>
                  </p>
                )}
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Cupos:</strong> {actividad.users.length}/
                  {actividad.cupos}
                </p>
                <p>
                  <strong>Rango de edad:</strong> {actividad.desde} -{" "}
                  {actividad.hasta} años
                </p>
                <p>
                  <strong>Estado:</strong>
                  <span
                    className={`badge ${
                      actividad.actividadHabilitada
                        ? "bg-success"
                        : "bg-secondary"
                    } ms-2`}
                  >
                    {actividad.actividadHabilitada
                      ? "Habilitada"
                      : "Deshabilitada"}
                  </span>
                </p>
              </div>
            </div>
            {actividad.natacionAdaptada && (
              <div className="alert alert-info mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Esta actividad es para natación adaptada
              </div>
            )}
          </div>
        </div>
        {/* Tabla de usuarios inscritos */}
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Usuarios inscritos ({actividad.users.length})
              </h4>
            </div>
          </div>
          <div className="card-body p-0">
            <Tabla actividad={actividad} />
          </div>
        </div>
        {estadistica && estadistica.length > 0 && (
          <StadisticsTable stadistics={estadistica} />
        )}
      </div>
    );
  }

  return null;
}

export { InfoActividad };
