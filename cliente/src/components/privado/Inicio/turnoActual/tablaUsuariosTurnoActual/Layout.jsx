import { useMutation, useQueryClient } from "react-query";
import { agregarUsuarioApileta } from "../../../../../helpers/piletas/agregarUsuarioApileta";

import Tabla from "../../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import { baseUrl } from "../../../../../helpers/url";

import swal from "sweetalert2";

import style from "./style.module.css";

const agregarUsuarioAlTurno = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

function Layout({ usuarios }) {
  const queryClient = useQueryClient();

  const agregarUsuario = useMutation(agregarUsuarioAlTurno, {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.invalidateQueries("getUsrsByDate");
      }
      if (data.status === "error") {
        swal.fire({
          title: "Error!",
          text: data.message,
          icon: "error",
        });
      }
    },
  });

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
        cell: ({ row }) => {
          if (row.original.status === false) {
            return <div>Esperando Habilitacion</div>;
          }
          return (
            <button
              onClick={() => {
                agregarUsuario.mutate({
                  customId: row.original.customId,
                  nombre: row.original.nombre + " " + row.original.apellido,
                  actividad: row.original.activity[0].name,
                  pileta: row.original.activity[0].pileta,
                  horarioSalida: row.original.activity[0].hourFinish,
                });
              }}
              className="btn btn-success"
            >
              Agergar
            </button>
          );
        },
      },
    ];

    return (
      <div className={style.body}>
        {agregarUsuario.isLoading && (
          <div className="alert alert-warning">
            <h4 className="alert-heading">Cargando...</h4>
          </div>
        )}
        {agregarUsuario.isSuccess && (
          <div className="alert alert-success">
            <h4 className="alert-heading">Usuario agregado con éxito!</h4>
          </div>
        )}
        {agregarUsuario.isError && (
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{agregarUsuario.error.message}</p>
          </div>
        )}

        <Tabla data={usuarios.data.users} columns={columns} />
      </div>
    );
  }
}

export default Layout;
