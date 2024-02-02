import { useMutation, useQueryClient, useQuery } from "react-query";
import { agregarUsuarioApiletaTurnoSiguiente } from "../../../../helpers/piletas/agregarUsuarioASiguienteTurno";
import { getActivitiesByDateNextTurn } from "../../../../helpers/activitiesFetch/getActivitiesByDate";

import Tabla from "../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import style from "./style.module.css";

function Layout() {
  const usuarios = useQuery(
    "usuariosTurnoSiguiente",
    getActivitiesByDateNextTurn
  );

  const queryClient = useQueryClient();

  const agregarUsuario = useMutation({
    mutationFn: agregarUsuarioApiletaTurnoSiguiente,
    onSuccess: (data) => {
      queryClient.invalidateQueries("usuariosTurnoSiguiente");
    },
  });

  if (usuarios.isLoading)
    return (
      <h3 className="alert alert-secondary">
        Cargando Usuarios turno siguiente por favor espere...
      </h3>
    );

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
              agregarUsuario.mutate(row.original.customId);
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
        {agregarUsuario.isLoading && (
          <div className="alert alert-warning">
            <h4 className="alert-heading">Cargando...</h4>
          </div>
        )}
        {agregarUsuario.isSuccess && (
          <div className="alert alert-success">
            <h4 className="alert-heading">
              Usuario agregado con éxito al turno siguiente!
            </h4>
          </div>
        )}
        {agregarUsuario.isError && (
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{agregarUsuario.error.message}</p>
          </div>
        )}
        <h1>Usuarios Turno Siguiente</h1>
        <Tabla data={usuarios.data.users} columns={columns} />
      </div>
    );
  }
}

export default Layout;
