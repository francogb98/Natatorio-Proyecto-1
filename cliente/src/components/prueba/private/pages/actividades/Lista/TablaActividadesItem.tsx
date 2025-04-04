import React from "react";
import { Activity } from "../../../../models";
import { Link, useNavigate } from "react-router-dom";

interface ActividadesProps {
  actividades: Activity[];
}

function TablaActividadesItem({ actividades }: ActividadesProps) {
  const navigate = useNavigate();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">Horario</th>
            <th scope="col">Nombre</th>
            <th scope="col" className="d-none d-md-table-cell">
              Dias
            </th>
            <th scope="col">Cupos</th>
            <th scope="col" className="d-none d-sm-table-cell">
              Inscriptos
            </th>
            <th scope="col">Disponibles</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                  <span className="h5 text-muted">
                    No hay actividades registradas
                  </span>
                  <small className="text-muted">
                    Agrega una nueva actividad para comenzar
                  </small>
                </div>
              </td>
            </tr>
          ) : (
            actividades.map((activity: Activity) => (
              <tr key={activity._id}>
                <td data-label="Horario">
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">{activity.hourStart}</span>
                    <span className="text-muted small">
                      {activity.hourFinish}
                    </span>
                  </div>
                </td>
                <td data-label="Nombre">
                  <Link to={`${activity._id}`} className="text-decoration-none">
                    <span className="fw-semibold">{activity.name}</span>
                  </Link>
                </td>
                <td data-label="Dias" className="d-none d-md-table-cell">
                  <div className="d-flex flex-wrap gap-1">
                    {activity.date.map((dia, i) => (
                      <span
                        key={i}
                        className="badge bg-primary bg-opacity-10 text-primary"
                      >
                        {dia}
                      </span>
                    ))}
                  </div>
                </td>
                <td data-label="Cupos">
                  <span>{activity.cupos}</span>
                </td>
                <td data-label="Inscriptos" className="d-none d-sm-table-cell">
                  <span
                    className={
                      activity.users.length === activity.cupos
                        ? "text-danger"
                        : ""
                    }
                  >
                    {activity.users.length}
                  </span>
                </td>
                <td data-label="Disponibles">
                  <span
                    className={`badge ${
                      activity.cupos - activity.users.length === 0
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {activity.cupos - activity.users.length}
                  </span>
                </td>
                <td data-label="Acciones">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`editar/${activity._id}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                      <span className="d-none d-lg-inline ms-1">Editar</span>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Borrar"
                    >
                      <i className="bi bi-trash"></i>
                      <span className="d-none d-lg-inline ms-1">Borrar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaActividadesItem;
