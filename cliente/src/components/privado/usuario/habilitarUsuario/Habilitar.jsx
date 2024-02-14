import { useQuery } from "react-query";

//traigo todos los usuarios para habilitar

import { getUsuarios } from "../../../../helpers/getUsers";

import style from "./style.module.css";

import { Link } from "react-router-dom";
import TablaHabilitar from "./TablaHabilitar";

function Habilitar() {
  const { data, isSuccess, status, isLoading, refetch, isRefetching } =
    useQuery({
      queryKey: ["usuarios"],
      queryFn: getUsuarios,
    });

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

  if (isLoading) {
    return (
      <div className="alert alert-secondary text-center">
        <h3>Cargando Usuarios para habilitar por favor espere...</h3>
      </div>
    );
  }

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
          <div className="alert alert-secondary text-center">
            <h3>Cargando Usuarios para habilitar por favor espere...</h3>
            <img
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXloaXYzamtheW4yZ3Q0a2FwMG16aGw2ZGZxZWNmOWNzanE4M2lsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WFEpbNDqjs312EZ06H/giphy.gif"
              alt="Dog Swimming Sticker by Rede Genoma"
              style={{ width: "30%" }}
            ></img>
          </div>
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
            <div>Total usuario para habilitar: {data.users.length}</div>
            <div className={style.tablaBody}>
              <TablaHabilitar data={data.users} columns={columns} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Habilitar;
