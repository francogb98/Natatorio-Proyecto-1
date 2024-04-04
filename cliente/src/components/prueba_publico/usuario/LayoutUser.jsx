import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Datos from "./Datos";
import CargarArchivos from "./CargarArchivos";
import ActividadCard from "./ActividadCard";
import EditarDatos from "./EditarDatos";

function LayoutUser() {
  const { auth, userRefetch } = useContext(AuthContext);

  const [editarDatos, setEditarDatos] = useState(false);

  useEffect(() => {}, [editarDatos]);

  return (
    <div className="container mt-sm-3 mb-5 bg-light">
      <div className="row">
        <header className="text-center border-bottom">
          <img
            src={auth.user.foto}
            alt=""
            style={{
              widht: "200px",
              height: "200px",
              borderRadius: "50%",
            }}
          />
          <h2>
            {auth.user.nombre} {auth.user.apellido}
          </h2>
          <h4>{auth.user.customId}</h4>
        </header>
      </div>
      <div className="row pt-2">
        <section className="col-12 col-sm-6 border mb-3">
          <CargarArchivos user={auth.user} />
        </section>

        <section className="col-12 col-sm-6  text-center border p-2 mb-3 ">
          <h2 className="text-success">Actividad</h2>
          {auth.user.activity && auth.user.activity.length ? (
            auth.user.activity.map((actividad) => (
              <div key={actividad._id} className="border mb-2 p-3">
                <ActividadCard user={auth.user} actividad={actividad} />
              </div>
            ))
          ) : (
            <div>No tiene actividad</div>
          )}
        </section>

        <section className="col-12 border p-2">
          <div className="d-flex justify-content-between px-1">
            <h2 className="text-success">Datos</h2>

            <button
              className={`btn ${editarDatos ? "btn-danger" : "btn-primary"}`}
              onClick={() => {
                setEditarDatos(!editarDatos);
              }}
            >
              {editarDatos ? "X" : "Editar"}
            </button>
          </div>
          {editarDatos ? (
            <EditarDatos user={auth.user} />
          ) : (
            <Datos user={auth.user} />
          )}
        </section>
      </div>
    </div>
  );
}

export default LayoutUser;
