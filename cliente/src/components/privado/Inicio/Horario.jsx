import FormularioPrueba from "./FormularioPrueba";
import FormularioTurnoSiguiente from "./FormularioTurnoSiguiente";

import React, { useEffect, useState, useRef } from "react";
import { useMutation } from "react-query";
import { getActivitiesByDate } from "../../../helpers/activitiesFetch/getActivitiesByDate";

function Horario({ handleRegistrarUsuario, setInfoHOrario, handleEnd }) {
  // peticion de informacion de actividades

  // .

  const [dayActual, setDayActual] = useState("");

  const [horarioEnCurso, setHorarioEnCurso] = useState("");

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    const options = { weekday: "long" };
    const today = new Date();
    //el dia tiene que tener la primera letra en matuscula
    const dia = new Intl.DateTimeFormat("es-ES", options).format(today);

    setDayActual(dia.charAt(0).toUpperCase() + dia.slice(1));
    setHorarioEnCurso(hour);
  }, []);

  useEffect(() => {
    if (dayActual && horarioEnCurso) {
      getActivities.mutate({
        hourStart: horarioEnCurso + ":00",
        hourFinish: horarioEnCurso + 1 + ":00",
        date: dayActual,
      });
    }
  }, [horarioEnCurso]);

  //actualizar el horari
  return (
    <div>
      {!dayActual && !horarioEnCurso ? (
        <h1>Cagando</h1>
      ) : (
        <>
          <h2>Dia: {dayActual}</h2>
          <div className="d-flex gap-3">
            <h4>
              Horario en curso : {horarioEnCurso}:00 - {horarioEnCurso + 1}:00
            </h4>
            <button
              onClick={() => {
                setHorarioEnCurso(horarioEnCurso + 1);
                handleEnd();
              }}
              className="btn btn-sm btn-danger"
            >
              Siguiente Horario
            </button>
          </div>

          <div className="mb-3 mt-3">
            <FormularioPrueba
              handleRegistrarUsuario={handleRegistrarUsuario}
            ></FormularioPrueba>
          </div>
          <div>
            <FormularioTurnoSiguiente
              horaInicio={horarioEnCurso}
              dayActual={dayActual}
            ></FormularioTurnoSiguiente>
          </div>
        </>
      )}
    </div>
  );
}

export default Horario;
