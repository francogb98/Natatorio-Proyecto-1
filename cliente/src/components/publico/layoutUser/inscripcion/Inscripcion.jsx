import React, { useState } from "react";

import style from "./styles.module.css";

import { getInfoUser } from "../../../../helpers/fetch";
import { useQuery } from "react-query";

import TablaActividades from "./TablaActividades";
import { getActividadesNombre } from "../../../../helpers/activitiesFetch/getActividadesNombre";

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

  if (getActivity.isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (getActivity.isSuccess) {
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
            <TablaActividades
              actividad={actividadSeleccionada}
              colors={colors}
            />
          </div>
        )}

        {/* {getUser.data.user.fichaMedica &&
        getUser.data.user.certificadoHongos ? (
          <table className="table table-light table-striped-columns">
            <thead>
              <tr>
                <th scope="col">Horario (ingreso/salida)</th>
                <th scope="col">Actividad</th>
              </tr>
            </thead>
            <tbody>
              {getHours.data.data.hours.map((hour) => (
                <tr key={hour._id}>
                  <td style={{ width: "10px" }}>
                    {hour.hourStart} - {hour.hourFinish}
                  </td>
                  <td>
                    {getActivity.data.data.activity.filter(
                      (activity) => activity.hourStart === hour.hourStart
                    ).length === 0 ? (
                      <option defaultValue={null}>
                        No hay actividades disponibles
                      </option>
                    ) : (
                      <>
                        {getActivity.data.data.activity
                          .filter(
                            (activity) => activity.hourStart === hour.hourStart
                          )
                          .map((activity, i) => (
                            <div
                              key={i}
                              className={style.td__bg}
                              style={
                                activity.userRegister >= 50
                                  ? {
                                      background: "rgb(250,0,0,0.2)",
                                    }
                                  : null
                              }
                            >
                              <div>
                                <p>
                                  Actividad:{" "}
                                  <span
                                    style={{
                                      color: "red",
                                      fontWeight: "550",
                                    }}
                                  >
                                    {activity.name}
                                  </span>
                                </p>
                                <p>
                                  Dias:
                                  <span
                                    style={{
                                      color: "blue",
                                      fontWeight: "550",
                                    }}
                                  >
                                    {activity.date.join(" - ")}
                                  </span>
                                </p>
                                <p>
                                  Pileta:
                                  <span
                                    style={{
                                      color: "violet",
                                      fontWeight: "550",
                                    }}
                                  >
                                    {activity.pileta}
                                  </span>
                                </p>
                                <p>
                                  <span
                                    style={
                                      activity.userRegister >= 50
                                        ? {
                                            color: "red",
                                            fontWeight: "550",
                                          }
                                        : {
                                            color: "green",
                                            fontWeight: "550",
                                          }
                                    }
                                  >
                                    {activity.userRegister >= 50
                                      ? "No Hay cupos disponibles"
                                      : "Disponible"}
                                  </span>
                                </p>
                              </div>
                              {activity.userRegister < 50 && (
                                <button
                                  className="btn btn-primary"
                                  style={{ height: "70px" }}
                                  disabled={activity.userRegister >= 50}
                                  onClick={() => handleRegister(activity._id)}
                                >
                                  Inscribirse
                                </button>
                              )}
                            </div>
                          ))}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null} */}
      </div>
    );
  }
}

export default Inscripcion;
