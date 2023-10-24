import React, { useContext, useEffect, useState } from "react";

import style from "./styles.module.css";

import { fetchConToken, fetchConTokenHours } from "../../../../helpers/fetch";
import { useMutation, useQuery } from "react-query";

import isEqual from "lodash/isEqual";

import Swal from "sweetalert2";

function Inscripcion() {
  const registerInActivity = useMutation({
    mutationKey: "registerUser",
    mutationFn: fetchConToken,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: "Se ha inscripto correctamente en la actividad",
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        title: error.status.toUpperCase(),
        text: error.message,
        icon: error.status,
        confirmButtonText: "Aceptar",
      });
    },
  });

  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: fetchConToken,
  });

  const getHours = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
  });

  const handleRegister = (id) => {
    registerInActivity.mutate({
      endpoint: "user/resgisterActivity",
      data: id,
      method: "POST",
    });
  };

  if (getActivity.isError || getHours.isError) {
    return <h1>ERROR</h1>;
  }

  if (getActivity.isLoading || getHours.isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (getActivity.isSuccess && getHours.isSuccess) {
    // quiero que getHours.data.data.hours se ordene de menor a mayor

    getHours.data.data.hours.sort((a, b) => {
      if (a.hourStart < b.hourStart) {
        return -1;
      }
      if (a.hourStart > b.hourStart) {
        return 1;
      }
      return 0;
    });

    return (
      <div className={style.container}>
        <ol
          style={{
            background: "#fff",

            maxWidth: "550px",
            padding: "50px",
          }}
        >
          <li>
            <h6>
              Antes de poder inscribirte en una actividad deberas verificar que
              en la seccion de perfil tus datos esten completos{" "}
              <span style={{ color: "green" }}>
                (recuerda debes cargar tu ficha medica){" "}
              </span>
            </h6>
          </li>

          <li>
            <h6>
              Debajo de este mensaje podras ver las actividades disponibles, en
              la parte izquierda veras los horarios y en la parte derecha las
              actividades disponibles
            </h6>
          </li>
          <li>
            <h6>
              En la columna derecha podras observar que la actividad cuenta con
              el nombre de la mismsa, los dias que se dicta, la pileta donde se
              dicta dicha actividad y si tiene cupos disponibles
            </h6>
          </li>
          <li>
            <h6>
              Si la actividad tiene cupos disponibles podras inscribirte
              presionando el boton "Inscribirse"
            </h6>
          </li>
          <li>
            <h6>
              Una vez que te hayas inscripto, verificaremos que tus datos esten
              completos y que no te hayas inscripto en otra actividad, si todo
              esta correcto te enviaremos un correo de confirmacion.
              <span style={{ color: "green" }}>
                (en la seccion de perfil aparecera el estado de tu solicitud)
              </span>
            </h6>
          </li>
          <li>
            <h6 style={{ color: "red" }}>
              Recuerda cargar tu ficha medica en la seccion de perfil, de lo
              contrario tu solicitud sera denegada hasta que cargues dicha
              documentacion
            </h6>
          </li>
        </ol>
        {registerInActivity.isLoading && (
          <div style={{ position: "fixed", top: "0", width: "350px" }}>
            <div class="alert alert-danger" role="alert">
              <h4>Procesando Inscripcion...</h4>
            </div>
          </div>
        )}
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
      </div>
    );
  }
}

export default Inscripcion;
