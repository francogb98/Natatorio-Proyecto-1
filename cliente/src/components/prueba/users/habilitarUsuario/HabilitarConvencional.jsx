import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import LoadingTable from "./tablas/LoadingTable";
import { baseUrl } from "../../../../helpers/url";
import { Link, useParams } from "react-router-dom";
import TablaHabilitar from "./tablas/TablaHabilitar";

import UserImages from "../utilidades/UserImages";
import Funciones_administrador from "../hooks/Funciones_administrador";

function HabilitarConvencional() {
  const { filtro } = useParams();

  const { inhabilitar, habilitar } = Funciones_administrador();

  const traerUsuarios = async () => {
    const res = await fetch(`${baseUrl}user/${filtro}`, {
      method: "GET",
    });
    const data = await res.json();

    return data;
  };

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery(
    "usuarios",
    traerUsuarios
  );

  const [imagen, setImagen] = useState(null);
  const [view, setView] = useState(false);

  useEffect(() => {}, [view, imagen]);

  useEffect(() => {
    refetch();
  }, [filtro]);

  if (isLoading || isRefetching) {
    return <LoadingTable find={true} />;
  }

  if (!data.users) {
    return <LoadingTable find={false} />;
  }

  if (data.users) {
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
            to={`/home/usuario/${row.original.customId}`}
          >{`${row.original.nombre}`}</Link>
        ),
      },
      {
        header: "Actividad",
        accessorKey: "actividad",
        cell: ({ row }) => <div>{row.original.activity[0].name}</div>,
      },
      {
        header: "Archivos",
        accessorKey: "archivos",
        cell: ({ row }) => (
          <div>
            <p
              onClick={() => {
                setView(true);
                setImagen(row.original.fichaMedica);
              }}
              className="text-primary"
              style={{
                cursor: "pointer",
              }}
            >
              Ficha
            </p>
            <p
              onClick={() => {
                setView(true);
                setImagen(row.original.certificadoHongos);
              }}
              className="text-primary"
              style={{
                cursor: "pointer",
              }}
            >
              PyM
            </p>
            <p
              onClick={() => {
                setView(true);
                setImagen(row.original.fotoDocumento);
              }}
              className="text-primary"
              style={{
                cursor: "pointer",
              }}
            >
              DNI
            </p>
          </div>
        ),
      },
      {
        header: "Habilitar",
        accessorKey: "habilitar",
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              habilitar.mutate({ id: row.original._id });
            }}
          >
            Habilitar
          </button>
        ),
      },
    ];

    return (
      <div className="text-center mt-2">
        <h2>Seccion Habilitar Usuarios</h2>
        <TablaHabilitar data={data.users} columns={columns} />;
        {view && (
          <UserImages imagen={imagen} setView={setView} setImagen={setImagen} />
        )}
      </div>
    );
  }
}

export default HabilitarConvencional;
