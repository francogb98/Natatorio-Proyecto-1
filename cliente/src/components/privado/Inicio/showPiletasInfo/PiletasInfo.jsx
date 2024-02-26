import React from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";

import Tabla from "../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import style from "./style.module.css";
import { baseUrl } from "../../../../helpers/url";
import Swal from "sweetalert2";

const traerInfoTablas = async () => {
  const res = await fetch(`${baseUrl}pileta`);
  const data = await res.json();
  return data;
};

const eliminarUsuario = async (content) => {
  const res = await fetch(`${baseUrl}pileta/eliminar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

function PiletasInfo() {
  const { data, isLoading, error, refetch, isRefetching, isFetching } =
    useQuery({ queryKey: ["piletas"], queryFn: traerInfoTablas });

  const queryClient = useQueryClient();

  const eliminar = useMutation({
    mutationFn: eliminarUsuario,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario quitado de la pileta",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });

        queryClient.invalidateQueries("piletas");
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Usuario ya agregado",
          icon: "error",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  //accedo a la hora actual
  let horaActual = new Date().getHours();
  horaActual = horaActual < 10 ? `0${horaActual}:00` : `${horaActual}:00`;

  //quiero que haga un refetch cada 1 minuto

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 120000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="alert alert-secondary text-center">
        <h3>Cargando Informacion de las piletas por favor espere...</h3>
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXloaXYzamtheW4yZ3Q0a2FwMG16aGw2ZGZxZWNmOWNzanE4M2lsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WFEpbNDqjs312EZ06H/giphy.gif"
          alt="Dog Swimming Sticker by Rede Genoma"
          style={{ width: "30%" }}
        ></img>
      </div>
    );
  }
  if (isFetching) {
    return (
      <div className="alert alert-secondary text-center">
        <h3>Cargando Informacion de las piletas por favor espere...</h3>
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXloaXYzamtheW4yZ3Q0a2FwMG16aGw2ZGZxZWNmOWNzanE4M2lsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WFEpbNDqjs312EZ06H/giphy.gif"
          alt="Dog Swimming Sticker by Rede Genoma"
          style={{ width: "30%" }}
        ></img>
      </div>
    );
  }

  if (error) {
    return <h1>Ha ocurrido un error: {error.message}</h1>;
  }

  if (!data) {
    return <h1>Cargando Datos</h1>;
  }

  const columns = [
    {
      header: "ID",
      accessorKey: "customid",
    },
    {
      header: "Nombre y Apellido",
      accessorKey: "apellido",
      cell: ({ row }) => (
        <Link
          to={`/admin/panel/usuario/${row.original.customid}`}
        >{`${row.original.nombre}`}</Link>
      ),
    },
    {
      header: "Actividad",
      accessorKey: "actividad",
      cell: ({ row }) => <div>{row.original.actividad}</div>,
    },
    {
      header: "Salida",
      accessorKey: "eliminar",
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            eliminar.mutate({ customid: row.original.customid });
          }}
        >
          X
        </button>
      ),
    },
  ];

  return (
    <div className={style.section}>
      <button className={style.button} onClick={() => refetch()}>
        Recargar
      </button>

      {isRefetching ? (
        <h1>Cargando...</h1>
      ) : error ? (
        <h1>Ha ocurrido un error: {error.message}</h1>
      ) : null}

      <div className={style.body}>
        {data.resultado.length ? (
          data.resultado.map((info, i) => (
            <div key={i}>
              <>
                <h3>
                  {info.pileta.charAt(0).toUpperCase() + info.pileta.slice(1)}
                </h3>
                <p>Total usuarios :{info.users.length}</p>
                <Tabla data={info.users} columns={columns} />
              </>
            </div>
          ))
        ) : (
          <h2>
            Inicie un nuevo turno para ver las Piletas, luego dar click en el
            boton de recargar
          </h2>
        )}
      </div>
    </div>
  );
}

export default PiletasInfo;
