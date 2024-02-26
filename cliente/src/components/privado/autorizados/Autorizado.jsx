import React, { useContext } from "react";

import { baseUrl } from "../../../helpers/url";

import { useMutation, useQuery, useQueryClient } from "react-query";
import Tabla from "../../../utilidades/Tabla";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const autorizarUsuaRIO = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta/autorizar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

const eliminarUsuario = async (content) => {
  const res = await fetch(`${baseUrl}autorizado`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

const listaUsuarios = async () => {
  const res = await fetch(`${baseUrl}autorizado`);
  const data = await res.json();
  return data;
};

function Autorizado() {
  const { auth } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const usuarios = useQuery({
    queryFn: listaUsuarios,
    queryKey: ["lista_autorizados"],
  });

  const eliminar = useMutation({
    mutationFn: eliminarUsuario,
    onSuccess: (data) => {
      Swal.fire({
        title: "Usuario Eliminado",
        icon: "success",
        text: data.message,
        confirmButtonText: "Aceptar",
      });

      queryClient.invalidateQueries("lista_autorizados");
    },
  });
  const autorizar = useMutation({
    mutationFn: autorizarUsuaRIO,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Usuario ya agregado",
          icon: "error",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      queryClient.invalidateQueries("piletas");
    },
  });

  const columnEliminar = {
    header: "Eliminar",
    accessorKey: "eliminar",
    cell: ({ row }) => {
      return (
        <button
          onClick={() => {
            eliminar.mutate({ user: row.original.user._id });
          }}
          className="btn btn-danger"
        >
          X
        </button>
      );
    },
  };

  if (usuarios.isLoading) {
    return <h1>Cargando Usuarios...</h1>;
  }

  if (usuarios.isSuccess && usuarios.data) {
    const columns = [
      {
        header: "ID",
        accessorKey: "customId",
        cell: ({ row }) => <div>{`${row.original.user.customId} `}</div>,
      },
      {
        header: "Nombre y Apellido",
        accessorKey: "apellido",
        cell: ({ row }) => (
          <Link
            to={`/admin/panel/usuario/${row.original.user._id}`}
          >{`${row.original.user.apellido} ${row.original.user.nombre}`}</Link>
        ),
      },
      {
        header: "Habilitar",
        accessorKey: "habilitar",
        cell: ({ row }) => {
          return (
            <button
              onClick={() => {
                autorizar.mutate({ id: row.original.user.customId });
              }}
              className="btn btn-success"
            >
              Agergar
            </button>
          );
        },
      },
      auth.role === "SUPER_ADMIN" && columnEliminar,
    ];

    return (
      <div>
        <h1>Autorizado</h1>

        <Tabla data={usuarios.data.users} columns={columns} />
      </div>
    );
  }
}

export default Autorizado;
