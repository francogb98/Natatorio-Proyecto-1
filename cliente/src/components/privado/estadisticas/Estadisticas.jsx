import React, { useEffect } from "react";
import { getEstadisticas } from "../../../helpers/estadisticas/estadisticas";
import { useQuery } from "react-query";

function Estadisticas() {
  const { data, isLoading } = useQuery("getEstadisticas", getEstadisticas);

  useEffect(() => {
    data;
  }, [data]);

  return (
    <div>
      <table className="table table-stripped">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Año</th>
            <th>Usuarios</th>
            <th>Actividad</th>
            <th>Horario</th>
            <th>Dias</th>
          </tr>
        </thead>
        <tbody>
          {data?.stadistics.map((estadistica) => {
            return (
              <tr>
                <td>{estadistica.mes}</td>
                <td>{estadistica.year ? estadistica.year : null}</td>
                <td>{estadistica.usersQuantity}</td>
                <td>{estadistica.activity.name}</td>
                <td>
                  {estadistica.activity.hourStart} -{" "}
                  {estadistica.activity.hourFinish}
                </td>
                <td>{estadistica.activity.date.join(" -")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Estadisticas;
