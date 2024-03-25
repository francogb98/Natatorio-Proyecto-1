import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import LoadingTable from "./tablas/LoadingTable";
import { baseUrl } from "../../../../helpers/url";
import { Link, useParams } from "react-router-dom";
import TablaHabilitar from "./tablas/TablaHabilitar";

import UserImages from "../utilidades/UserImages";
import Funciones_administrador from "../hooks/Funciones_administrador";
import { Toaster } from "sonner";

function HabilitarConvencional() {
  const { filtro } = useParams();

  const { inhabilitar, habilitar, quitar_lista } = Funciones_administrador();

  const traerUsuarios = async () => {
    const res = await fetch(`${baseUrl}user/${filtro}`, {
      method: "GET",
    });
    const data = await res.json();

    return data;
  };

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery({
    queryKey: ["usuarios"],
    queryFn: traerUsuarios,
  });

  const [imagen, setImagen] = useState(null);
  const [view, setView] = useState(false);

  useEffect(() => {}, [view, imagen]);

  useEffect(() => {
    refetch();
  }, [filtro]);

  if (isLoading /*|| isRefetching*/) {
    return <LoadingTable find={true} />;
  }

  if (!data.users) {
    return <LoadingTable find={false} />;
  }

  if (data.users) {
    let columns = [];
    if (filtro !== "faltas" && filtro !== "certificado") {
      columns = [
        {
          header: "ID",
          accessorKey: "customId",
        },
        {
          header: "Nombre y Apellido",
          accessorKey: "apellido",
          cell: ({ row }) => (
            <Link to={`/home/usuario/${row.original.customId}`}>
              {row.original.nombre} {row.original.apellido}
            </Link>
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
    } else {
      columns = [
        {
          header: "ID",
          accessorKey: "customId",
        },
        {
          header: "Nombre y Apellido",
          accessorKey: "apellido",
          cell: ({ row }) => (
            <Link to={`/home/usuario/${row.original.customId}`}>
              {row.original.nombre} {row.original.apellido}
            </Link>
          ),
        },
        {
          header: "Actividad",
          accessorKey: "activity",
          cell: ({ row }) => <div>{row.original.activity[0].name}</div>,
        },
        {
          header: "fecha de carga",
          accessorKey: "fechaCargaCertificadoHongos",
          cell: ({ row }) => (
            <div>{row.original.fechaCargaCertificadoHongos}</div>
          ),
        },
        {
          header: "Inhabilitar",
          accessorKey: "Inhabilitar",
          cell: ({ row }) => (
            <div div className="d-flex gap-3 flex-wrap justify-content-center">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  inhabilitar.mutate({
                    id: row.original._id,

                    asunto:
                      filtro == "certificado"
                        ? "Certificado no Actualizado a tiempo"
                        : "Exceso de inasistencias",
                    cuerpo:
                      filtro == "certificado"
                        ? "Debido a que el usuario no actualizo a tiempo su certificado de pediculosis y micosis se le a dado de baja de dicha actividad. Por favor actualizar el documento y volver a inscibirse en una actividad. Muchas gracias. atte:Administracion del Natatorio"
                        : "Debido a que el usuario excedio el limite de faltas se le a dado de baja de dicha actividad. Por favor actualizar el documento y volver a inscibirse en una actividad. Muchas gracias. atte:Administracion del Natatorio",
                  });
                }}
              >
                Inhabilitar
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  quitar_lista.mutate({ id: row.original._id });
                }}
              >
                Quitar de lista
              </button>
            </div>
          ),
        },
      ];
    }

    return (
      <div className="text-center mt-2">
        <h2>
          Seccion{" "}
          {filtro !== "faltas" && filtro !== "certificado"
            ? "Habilitar Usuarios"
            : "dar de baja usuario"}
        </h2>
        <TablaHabilitar data={data.users} columns={columns} />;
        {view && (
          <UserImages imagen={imagen} setView={setView} setImagen={setImagen} />
        )}
        <Toaster position="bottom-right" richColors />
      </div>
    );
  }
}

export default HabilitarConvencional;
