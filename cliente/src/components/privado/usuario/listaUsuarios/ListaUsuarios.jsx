import { useQuery } from "react-query";
import { getAllUsuarios } from "../../../../helpers/getUsers";
import Tabla from "../../../../utilidades/Tabla";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function ListaUsuarios() {
  const { data, isLoading, isError, error } = useQuery(
    "usuarios",
    getAllUsuarios
  );

  useEffect(() => {}, [data]);

  if (isLoading) {
    return (
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Cargando...
      </h1>
    );
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
        <Link
          to={`/admin/panel/usuario/${row.original._id}`}
        >{`${row.original.apellido} ${row.original.nombre}`}</Link>
      ),
    },

    {
      header: "Actividad",
      accessorKey: "activity",
      accessorFn: (row) => {
        if (row.activity && row.status) {
          return row.activity[0]?.name;
        }
        if (row.activity && !row.status) {
          return "-";
        }
        if (!row.activity) {
          return "-";
        }
      },
    },
    {
      header: "Horario",
      accessorKey: "horario",
      accessorFn: (row) => {
        if (row.activity && row.status) {
          return `${row.activity[0]?.hourStart} - ${row.activity[0]?.hourFinish}`;
        }
        if (row.activity && !row.status) {
          return "Esperando Habilitacion";
        }
        if (!row.activity) {
          return "No tiene actividad";
        }
      },
    },
    {
      header: "Dias",
      accessorKey: "dias",
      accessorFn: (row) => {
        if (row.activity && row.status) {
          return row.activity[0]?.date.join(" - ");
        }
        if (row.activity && !row.status) {
          return "-";
        }
        if (!row.activity) {
          return "-";
        }
      },
    },

    //hacer buttons para habilitar y deshabilitar
    {
      header: "Asistencia",
      accessorKey: "asistencia",
      accessorFn: (row) => {
        return row.asistencia[row.asistencia.length]
          ? row.asistencia[row.asistencia.length]
          : "No se registran";
      },
    },
  ];
  if (data?.users) {
    return (
      <div>
        <Tabla data={data.users} columns={columns} />
      </div>
    );
  }
}

export default ListaUsuarios;
