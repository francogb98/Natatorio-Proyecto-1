import React from "react";
import { Activity } from "../../../../models";
import { useNavigate } from "react-router-dom";

interface ActividadesProps {
  actividades: Activity[];
}

function TablaActividadesItem({ actividades }: ActividadesProps) {
  const navigate = useNavigate();
  return (
    <table className="table table-striped table-hover table-bordered table-responsive">
      <thead>
        <tr>
          <th scope="col">Horario</th>
          <th scope="col">Nombre</th>
          <th scope="col">Dias</th>
          <th scope="col">Cupos</th>
          <th scope="col">Usuario Registrados</th>
          <th scope="col">Disponibles</th>
          <th scope="col">Editar</th>
          <th scope="col">Borrar</th>
        </tr>
      </thead>
      <tbody>
        {actividades.length === 0 ? (
          <tr className="text-center">
            <td colSpan={8} className="text-center h4 p-3">
              No hay actividades
            </td>
          </tr>
        ) : (
          actividades.map((activity: Activity) => (
            <tr key={activity._id} style={{ cursor: "pointer" }}>
              <td>
                {activity.hourStart} - {activity.hourFinish}
              </td>
              <td>{activity.name}</td>
              <td>{activity.date.join(" - ")}</td>
              <td>{activity.cupos}</td>
              <td>{activity.users.length}</td>
              <td>{activity.cupos - activity.users.length}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`editar/${activity._id}`)}
                >
                  Editar
                </button>
              </td>
              <td>
                <button className="btn btn-danger">Borrar</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TablaActividadesItem;
