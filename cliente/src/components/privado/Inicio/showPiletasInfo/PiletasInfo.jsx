import React from "react";

import { useQuery } from "react-query";

import { getPiletas } from "../../../../helpers/piletas/getPiletas";
import Tabla from "../../../../utilidades/Tabla";
import { Link } from "react-router-dom";

import style from "./style.module.css";

function PiletasInfo() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    "piletas",
    getPiletas
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
      accessorKey: "customId",
    },
    {
      header: "Nombre y Apellido",
      accessorKey: "apellido",
      cell: ({ row }) => (
        <Link
          to={`/admin/panel/usuario/${row.original._id}`}
          style={
            horaActual !== row.original.activity[0].hourStart
              ? { color: "red" }
              : null
          }
        >{`${row.original.apellido} ${row.original.nombre}`}</Link>
      ),
    },
    {
      header: "Actividad",
      accessorKey: "actividad",
      cell: ({ row }) => <div>{row.original.activity[0].name}</div>,
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
        {data.piletas.map((info, i) => (
          <div key={i}>
            <h3>
              {info.pileta.charAt(0).toUpperCase() + info.pileta.slice(1)}
            </h3>
            <p>Total usuarios :{info.users.length}</p>
            <Tabla data={info.users} columns={columns} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PiletasInfo;
