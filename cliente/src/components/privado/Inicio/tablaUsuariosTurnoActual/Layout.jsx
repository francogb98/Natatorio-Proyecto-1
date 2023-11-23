import React, { useEffect } from "react";

import { useMutation } from "react-query";
import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate";

import Tabla from "../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import style from "./style.module.css";
import useDiaYHoraActual from "../UseDay";

function Layout({ socket, setCargando, usuarios }) {
  const { horaActual, diaActualEnEspanol } = useDiaYHoraActual();

  const registrarUsuario = (id) => {
    setCargando(true);
    socket?.emit("agregar-usuario", {
      id,
    });
  };

  if (usuarios.isLoading)
    return <div className={style.loading}>Cargando...</div>;

  if (usuarios.isSuccess) {
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
        header: "Habilitar",
        accessorKey: "habilitar",
        cell: ({ row }) => (
          <button
            onClick={() => {
              registrarUsuario(row.original.customId);
            }}
            className="btn btn-success"
          >
            Agergar
          </button>
        ),
      },
    ];

    return (
      <div className={style.body}>
        <Tabla data={usuarios.data.users} columns={columns} />
      </div>
    );
  }
}

export default Layout;
