import { Link, useParams } from "react-router-dom";

import { useQuery } from "react-query";

import { getInfoActividades } from "../../../../helpers/activitiesFetch/getInfoActividades";

import { useEffect } from "react";
import Tabla from "../../../../utilidades/Tabla";

function InfoActividad() {
  const params = useParams();

  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: () => getInfoActividades(params.id),
  });

  useEffect(() => {}, [getActivity.isLoading]);

  if (getActivity.isLoading) return <h1>Cargando...</h1>;

  if (getActivity.isError) return <h1>Hubo un error al cargar la actividad</h1>;

  if (getActivity.isSuccess && !getActivity.data) return <h1>Cargando...</h1>;

  if (getActivity.isSuccess) {
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
            to={`/admin/panel/usuario/${row.original._id}`}
          >{`${row.original.apellido} ${row.original.nombre}`}</Link>
        ),
      },
      {
        header: "DNI",
        accessorKey: "dni",
      },
    ];
    if (getActivity.data?.users) {
      return (
        <>
          <Link to={"/admin/panel/actividades"}>
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
            <h1>Acitividad: {getActivity.data.name}</h1>
            <h3>
              {" "}
              <b>Dias:</b> {getActivity.data.date.join(" - ")}
            </h3>
            <h3>
              <b>Horario:</b>
              {getActivity.data.hourStart} - {getActivity.data.hourFinish}
            </h3>
            <h2 className="mt-3">Lista de Usuarios</h2>
            <Tabla data={getActivity.data.users} columns={columns} />
          </div>
        </>
      );
    }
  }
}

export default InfoActividad;
