import { useQuery } from "react-query";
import style from "./prueba.module.css";

import { Link } from "react-router-dom";
import TablaPrueba from "./Pileta";
import { info_tablas } from "../helpers/info_tablas.fetch";

function RegistroUsuarios() {
  const info_pileta = useQuery({
    queryKey: ["piletas"],
    queryFn: info_tablas,
  });
  if (info_pileta.isLoading) {
    return (
      <div className={style.fondo}>
        <main className={style.mainBody}>
          <section className="text-center">
            <h2 className="text-center">Pileta 25</h2>
            <hr />
            <div className="spinner-border text-primary  ms-1" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-center">Pileta 50</h2>
            <hr />
            <div className="spinner-border text-primary  ms-1" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-center">TunroSiguiente</h2>
            <hr />
            <div className="spinner-border text-primary  ms-1" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </section>
        </main>
      </div>
    );
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
          to={`usuario/${row.original.customid}`}
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
      cell: ({ row }) => <p>{row.original.horarioSalida}</p>,
    },
  ];

  return (
    <div className="container">
      <main className="row">
        {info_pileta.data.resultado.map((data) => {
          if (data.pileta !== "turnoSiguiente") {
            return (
              <section key={data._id} className="col-12 col-md-6">
                <div className="text-center">
                  <h2 className="fw-bolder">
                    {data.pileta.charAt(0).toUpperCase() + data.pileta.slice(1)}
                  </h2>
                  <h5>
                    Total Usuarios:{" "}
                    <span className="text-danger fw-bold">
                      {data.users.length}
                    </span>
                  </h5>
                </div>
                <hr />
                {data.users.length == 0 ? (
                  <div>No hay usuarios acreditados</div>
                ) : (
                  <TablaPrueba data={data.users} columns={columns} />
                )}
              </section>
            );
          }
        })}
      </main>
    </div>
  );
}

export default RegistroUsuarios;
