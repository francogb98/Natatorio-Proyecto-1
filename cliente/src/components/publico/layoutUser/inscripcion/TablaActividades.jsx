import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchConToken, fetchConTokenHours } from "../../../../helpers/fetch";

import style from "./styles.module.css";
import { getActivitysByName } from "../../../../helpers/activitiesFetch/getActivitysByName";
import { registrarUsuarioEnActividad } from "../../../../helpers/usersFetch/registrarUsuarioEnActividad";

import Swal from "sweetalert2";

function TablaActividades({ actividad, setActividadSeleccionada }) {
  //crear una tabla con todos los horarios y dias de la semana
  const [days, setDays] = useState([
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
  ]);

  const colors = [
    //solo colores claros
    "#FFC300",
    "#FF5733",
    "#C70039",
    "#900C3F",
    "#581845",
  ];

  const [actividadRegistrarse, setActividadRegistrarse] = useState(null);

  const getHours = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
  });

  const getActividades = useMutation({
    mutationKey: "getActividades",
    mutationFn: getActivitysByName,
  });

  const queryClient = useQueryClient();

  const registerInActivity = useMutation({
    mutationKey: "registerUser",
    mutationFn: registrarUsuarioEnActividad,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: "Se ha inscripto correctamente en la actividad, dirijase a la pagina principal para ver el estado de su solicitud ",
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
      queryClient.invalidateQueries("getUser");
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

  const handleSubmit = (id) => {
    registerInActivity.mutate({
      idActividad: id,
    });

    setActividadRegistrarse(null);
  };

  useEffect(() => {
    getActividades.mutate({ activity: actividad });
  }, []);

  useEffect(() => {
    getActividades.data;
  }, [getActividades.isLoading]);

  if (getActividades.isLoading || getHours.isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (getActividades.isError || getHours.isError) {
    return <h1>ERROR</h1>;
  }

  if (getHours.isSuccess) {
    getHours.data.data.hours.sort((a, b) => {
      if (a.hourStart < b.hourStart) {
        return -1;
      }
      if (a.hourStart > b.hourStart) {
        return 1;
      }
      return 0;
    });
  }

  const getNextColor = (i) => {
    const color = colors[(i + 1) % colors.length];

    return color;
  };

  return (
    <>
      <h4>Actividad : {actividad}</h4>
      <i
        className="bi bi-arrow-left-circle"
        onClick={() => {
          setActividadSeleccionada(null);
        }}
        style={{
          fontSize: "35px",
          color: "blue",
          cursor: "pointer",
        }}
      ></i>
      <table className={style.bodyTable}>
        <thead>
          <tr>
            <th scope="col">Hora</th>
            <th scope="col">Lunes</th>
            <th scope="col">Martes</th>
            <th scope="col">Miercoles</th>
            <th scope="col">Jueves</th>
            <th scope="col">Viernes</th>
          </tr>
        </thead>
        <tbody>
          {getHours.data?.data.hours.map((hour) => (
            <tr key={hour._id}>
              <td style={{ width: "30px" }}>
                {hour.hourStart} - {hour.hourFinish}
              </td>
              {days.map((day, i) => (
                <td key={day}>
                  {getActividades.data?.map((activity, i) => (
                    <div
                      key={activity._id}
                      style={{
                        backgroundColor: getNextColor(i),
                      }}
                      className={`${
                        activity.date.includes(day) &&
                        (activity.hourStart === hour.hourStart ||
                          activity.hourFinish === hour.hourFinish) &&
                        activity.name
                          ? style.letterActividad
                          : null
                      }`}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => {
                        setActividadRegistrarse(activity);
                      }}
                      //quiero que le ponga un color random a cada actividad
                    >
                      {activity.date.includes(day) &&
                      (activity.hourStart === hour.hourStart ||
                        activity.hourFinish === hour.hourFinish) &&
                      activity.name ? (
                        <div>{activity.name} </div>
                      ) : null}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                ¿Seguro que deseas inscribirte a la siguiente actividad?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setActividadRegistrarse(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              Nombre: {actividadRegistrarse?.name}
              <br />
              Dias: {actividadRegistrarse?.date.join(" - ")}
              <br />
              Hora de inicio: {actividadRegistrarse?.hourStart}
              <br />
              Hora de fin: {actividadRegistrarse?.hourFinish}
              <br />
              Edad: {actividadRegistrarse?.desde}años -{" "}
              {actividadRegistrarse?.hasta} años
              <br />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setActividadRegistrarse(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit(actividadRegistrarse?._id);
                }}
                data-bs-dismiss="modal"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>

      {registerInActivity.isLoading && (
        <div
          className="alert alert-danger"
          style={{
            position: "fixed",
            top: "0",
            width: "100%",
          }}
        >
          Registrando...
        </div>
      )}
    </>
  );
}

export default TablaActividades;
