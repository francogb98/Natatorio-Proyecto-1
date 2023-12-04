import React, { useState } from "react";

import style from "./styles.module.css";

import { getInfoUser } from "../../../../helpers/fetch";
import { useQuery } from "react-query";

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
    return <h1>ERROR</h1>;
  }

  if (getActivity.isLoading || !getActivity.data) {
    return <h1>Cargando...</h1>;
  }

  if (getActivity.isSuccess && getActivity.data) {
    // quiero que getHours.data.data.hours se ordene de menor a mayor

    //necesito traer todos los nombre de actividades y guardarlos en un estadom, sin que se reptina
    return (
      <div className={style.container}>
        <h1 className={style.title}>Inscripciones</h1>

        <div
          className={`${
            actividadSeleccionada ? style.noLook : style.buttonGroup
          }`}
        >
          <h4>Elige tu actividad:</h4>
          <p className="text-danger">
            Solo estaran disponibles las actividades que cuenten con cupos y
            sean acorde a tu edad.
          </p>
          {getActivity.data.map((activity, i) => (
            <button
              key={i}
              className={`btn btn-${colors[i]}`}
              onClick={() => setActividadSeleccionada(activity)}
            >
              {activity}
            </button>
          ))}
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
            <PruebaInscripciones actividad={actividadSeleccionada} />
          </div>
        )}
      </div>
    );
  }
}

export default Inscripcion;
