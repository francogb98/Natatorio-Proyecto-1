import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchConToken, fetchConTokenHours } from "../../../../helpers/fetch";

import style from "./styles.module.css";
import { getActivitysByName } from "../../../../helpers/activitiesFetch/getActivitysByName";
import { registrarUsuarioEnActividad } from "../../../../helpers/usersFetch/registrarUsuarioEnActividad";

import Swal from "sweetalert2";

function TablaActividades({ actividad }) {
  //crear una tabla con todos los horarios y dias de la semana
  const [days, setDays] = useState([
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
  ]);

  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

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

    setActividadSeleccionada(null);
  };

  useEffect(() => {
    getActividades.mutate({ activity: actividad });
  }, []);

  useEffect(() => {
    console.log(getActividades.data);
  }, [getActividades.isLoading]);

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

  return (
    <>
      <h4>Actividad : {actividad}</h4>
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
              {days.map((day) => (
                <td key={day}>
                  {getActividades.data?.map((activity, i) => (
                    <div
                      key={activity._id}
                      className={`${style.letterActividad}`}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => {
                        setActividadSeleccionada(activity);
                      }}
                      //quiero que le ponga un color random a cada actividad
                    >
                      {activity.date.includes(day) &&
                      (activity.hourStart === hour.hourStart ||
                        activity.hourFinish === hour.hourFinish) &&
                      activity.name
                        ? activity.name + i
                        : null}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                ¿Seguro que deseas inscribirte a la siguiente actividad?
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setActividadSeleccionada(null);
                }}
              ></button>
            </div>
            <div class="modal-body">
              Nombre: {actividadSeleccionada?.name}
              <br />
              Dias: {actividadSeleccionada?.date.join(" - ")}
              <br />
              Hora de inicio: {actividadSeleccionada?.hourStart}
              <br />
              Hora de fin: {actividadSeleccionada?.hourFinish}
              <br />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setActividadSeleccionada(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => {
                  handleSubmit(actividadSeleccionada?._id);
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
