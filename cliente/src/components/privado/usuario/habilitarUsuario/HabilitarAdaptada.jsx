import { useQuery } from "react-query";

//traigo todos los usuarios para habilitar

import { getUsuariosAdaptada } from "../../../../helpers/getUsers";

import Tabla from "../../../../utilidades/Tabla";
import style from "./style.module.css";

import { Link } from "react-router-dom";

function HabilitarAdaptada() {
  const { data, status, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuariosAdaptada,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  const columns = [
    {
      header: "ID",
      accessorKey: "customId",
    },
    {
      header: "Nombre y Apellido",
      accessorKey: "apellido",
      cell: ({ row }) => (
        <div>{`${row.original.apellido} ${row.original.nombre}`}</div>
      ),
    },

    {
      header: "Actividad",
      accessorKey: "activity",
      accessorFn: (row) => {
        return row.activity ? row.activity[0]?.name : "no tiene";
      },
    },
    {
      header: "Horario",
      accessorKey: "horario",
      accessorFn: (row) => {
        return row.activity
          ? `${row.activity[0]?.hourStart} - ${row.activity[0]?.hourFinish}`
          : "no tiene";
      },
    },
    {
      header: "Dias",
      accessorKey: "dias",
      accessorFn: (row) => {
        return row.activity
          ? `${row.activity[0]?.date.join(" - ")}`
          : "no tiene";
      },
    },

    //hacer buttons para habilitar y deshabilitar
    {
      header: "Habilitar",
      accessorKey: "habilitar",
      cell: ({ row }) => (
        <Link
          to={`/admin/panel/usuario/${row.original._id}`}
          className="btn btn-success"
        >
          Habilitar
        </Link>
      ),
    },
  ];

  if (status === "error") {
    return <div>Error al obtener los usuarios</div>;
  }

  if (data.length === 0) {
    return <div>No hay usuarios para habilitar</div>;
  }

  return (
    <div className={style.body}>
      <section>
        {isRefetching ? (
          <div className={style.searchBox}>Recargando...</div>
        ) : (
          <>
            <header
              style={{
                width: "fit-content",
                margin: "10px auto",
              }}
            >
              <button
                className="btn btn-lg btn-warning"
                onClick={() => refetch()}
              >
                Recargar
              </button>
            </header>

            <Tabla data={data.users} columns={columns} />
          </>
        )}
      </section>
    </div>
  );
}

export default HabilitarAdaptada;
