import { Link, useParams } from "react-router-dom";

import { useQuery } from "react-query";

import { getInfoActividades } from "../../../helpers/activitiesFetch/getInfoActividades";

import { useEffect } from "react";
import Tabla from "../../../utilidades/Tabla";

import style from "./actividades.module.css";

function InfoActividad() {
  const { id } = useParams();
  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: () => getInfoActividades(id),
  });

  useEffect(() => {
    getActivity.refetch();
  }, []);

  if (getActivity.isLoading || getActivity.isRefetching)
    return <h1>Cargando...</h1>;

  if (getActivity.isError) return <h1>Hubo un error al cargar la actividad</h1>;

  if (getActivity.isSuccess && !getActivity.data) return <h1>Cargando...</h1>;

  if (getActivity.isSuccess && getActivity.data.actividad) {
    const columns = [
      {
        header: "ID",
        accessorKey: "customId",
      },
      {
        header: "Nombre y Apellido",
        accessorKey: "apellido",
        cell: ({ row }) => (
          <Link
            to={`/home/usuario/${row.original._id}`}
          >{`${row.original.apellido} ${row.original.nombre}`}</Link>
        ),
      },
      {
        header: "DNI",
        accessorKey: "dni",
      },
    ];
    if (getActivity.data?.actividad.users) {
      return (
        <>
          <Link to={"/home/actividades"}>
            <i
              className="bi bi-arrow-left-circle-fill"
              style={{
                fontSize: "3rem",
                color: "blue",
                cursor: "pointer",
              }}
            ></i>
          </Link>

          <div className="text-center">
            <h1>Acitividad: {getActivity.data.actividad.name}</h1>
            <h3>
              {" "}
              <b>Dias:</b> {getActivity.data.actividad.date.join(" - ")}
            </h3>
            <h3>
              <b>Horario:</b>
              {getActivity.data.actividad.hourStart} -{" "}
              {getActivity.data.actividad.hourFinish}
            </h3>
            <h2 className="mt-3">Lista de Usuarios</h2>
            <Tabla data={getActivity.data.actividad.users} columns={columns} />
          </div>

          <div>
            <h1>Estadisticas</h1>
            <table className={style.table}>
              <thead>
                <th>Mes</th>
                <th>Dias dictada</th>
                <th>Usuarios Asistido</th>
                <th>Promedio por clase</th>
              </thead>
              <tbody>
                {getActivity.data?.estadistica.map((estadistica) => (
                  <tr>
                    <td>{estadistica.mes}</td>
                    <td>{estadistica.dias.length}</td>
                    <td>{estadistica.usersQuantity}</td>
                    <td>
                      {Math.floor(
                        estadistica.usersQuantity / estadistica.dias.length
                      )}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  }
}

export default InfoActividad;
