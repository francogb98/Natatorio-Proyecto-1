import React from "react";

import { useQuery } from "react-query";

import { getPiletas } from "../../../../helpers/piletas/getPiletas";
import Tabla from "../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import style from "./style.module.css";
import { baseUrl } from "../../../../helpers/url";

const traerInfoTablas = async () => {
  const res = await fetch(`${baseUrl}pileta`);
  const data = await res.json();
  return data;
};

function PiletasInfo() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    "piletas",
    traerInfoTablas
  );

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
        {data.map((info, i) => (
          <div key={i}>
            <h3>
              {info.pileta[0].pileta.charAt(0).toUpperCase() +
                info.pileta[0].pileta.slice(1)}
            </h3>
            <p>Total usuarios :{info.pileta[0].users.length}</p>
            <Tabla data={info.pileta[0].users} columns={columns} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PiletasInfo;
