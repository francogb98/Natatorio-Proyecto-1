import React, { useState } from "react";

import style from "./styles.module.css";

import { getInfoUser } from "../../../../helpers/fetch";
import { useQuery } from "react-query";

import { Link, useLocation } from "react-router-dom";

import TablaActividades from "./TablaActividades";
import { getActividadesNombre } from "../../../../helpers/activitiesFetch/getActividadesNombre";
import PruebaInscripciones from "./PruebaInscripciones";

function Inscripcion() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const [colors, setColors] = useState([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ]);

  const location = useLocation();
  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        return data;
      }
    },
  });

  if (!getUser.data) {
    return (
      <>
        <h1>Usuario no encontrado </h1>
        <button
          onClick={() => {
            getUser.refetch();
          }}
          className="btn btn-primary"
        >
          Recargar
        </button>
      </>
    );
  }

  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: getActividadesNombre,
  });

  if (getActivity.isError) {
    return (
      <div className={style.container}>
        <h1>ERROR</h1>
      </div>
    );
  }

  if (getActivity.isLoading || !getActivity.data) {
    return (
      <div className={style.container}>
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (getActivity.isSuccess && getActivity.data) {
    // quiero que getHours.data.data.hours se ordene de menor a mayor

    console.log(getUser.data.user);

    //necesito traer todos los nombre de actividades y guardarlos en un estadom, sin que se reptina
    return (
      <div className={style.container}>
        {!actividadSeleccionada ? (
          <>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Inscripciones /
                </li>
              </ol>
            </nav>
            <h1 className={style.title}>Inscripciones</h1>

            <div className="alert alert-info">
              Si ya estas inscripto en una actividad y deseas cambiarla, ve a la
              seccion de <Link to={"editarPerfil"}>Perfil</Link> y da de baja la
              actividad en la que estas inscripto.
            </div>
          </>
        ) : null}

        <div
          className={`${
            actividadSeleccionada ? style.noLook : style.buttonGroup
          }`}
        >
          {getUser.data.user.activity?.length ? (
            <div className="alert alert-info d-block mx-auto">
              <div>
                Ya estas inscripto en la actividad:{" "}
                <span className="text-success">
                  {getUser.data.user.activity[0].name}
                </span>
              </div>
              <div>
                Estado de su Solicitud:{" "}
                {getUser.data.user.status ? (
                  <span className="text-success">Aprobado</span>
                ) : (
                  <span className="text-danger">Esperando Aprobacion</span>
                )}
              </div>
            </div>
          ) : (
            <>
              <h4>Elige tu actividad:</h4>
              {getActivity.data.map((activity, i) => (
                <button
                  key={i}
                  className={`btn btn-${colors[i]}`}
                  onClick={() => setActividadSeleccionada(activity)}
                >
                  {activity}
                </button>
              ))}
            </>
          )}
        </div>
        {actividadSeleccionada && (
          <div
            className={`${
              actividadSeleccionada ? style.tablaActividades : style.noLook
            }`}
          >
            {/* <TablaActividades
              actividad={actividadSeleccionada}
              setActividadSeleccionada={setActividadSeleccionada}
            /> */}
            <PruebaInscripciones
              actividad={actividadSeleccionada}
              setActividadSeleccionada={setActividadSeleccionada}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Inscripcion;
