import React, { useState } from "react";
import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate";
import { useMutation } from "react-query";

function FormularioInicioDia({ data, setInicioHorario, setUsersRegistered }) {
  const getActivities = useMutation(getActivitiesByDate, {
    onSuccess: (data) => {
      if (data.status == "success") {
        //data.data.activity es un array necesito que me agregue los usuarios a un array
        setUsersRegistered(
          data.data.activity.map((activity) => activity.users)
        );
        setInicioHorario({
          status: true,
          date: args.date,
          hourStart: args.hourStart,
          hourFinish: args.hourFinish,
        });
      }
    },
  });
  const [days, setDays] = useState([
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
  ]);
  const [args, setArgs] = useState({
    date: "",
    hourStart: "",
    hourFinish: "",
    idUser: "",
  });

  const handleChange = (e) => {
    const selectedValue = JSON.parse(e.target.value); // Parse the JSON string
    setArgs({
      ...args,
      hourStart: selectedValue.hourStart,
      hourFinish: selectedValue.hourFinish,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getActivities.mutate(args);
  };
  return (
    <div>
      <h1>Iniciar Actividad</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="dni" className={`form-label fw-bold`}>
            Dia
          </label>
          <select
            className="form-select"
            name="date"
            id="date"
            onChange={(e) => {
              setArgs({ ...args, date: e.target.value });
            }}
            value={args.date}
          >
            <option value="null">--Dia--</option>
            {days.map((day, i) => (
              <option value={day} key={i}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="dni" className={`form-label  mt-2 fw-bold`}>
            Horario
          </label>
          <select
            className="form-select"
            name="hours"
            id="hours"
            onChange={handleChange}
          >
            <option value="null">--Horario--</option>
            {data.data.hours.map((hour, i) => (
              <option
                value={JSON.stringify({
                  hourStart: hour.hourStart,
                  hourFinish: hour.hourFinish,
                })}
                key={i}
              >
                {hour.hourStart} - {hour.hourFinish}
              </option>
            ))}
          </select>
        </div>
        <div>
          {getActivities.isSuccess && getActivities.data.status == "error" && (
            <h3>{getActivities.data.message}</h3>
          )}
          {getActivities.isLoading && (
            <div className="spinner-border text-primary mt-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <button
          className="btn btn-lg btn-danger"
          disabled={
            getActivities.isLoading ||
            args.date == "" ||
            args.hourStart == "" ||
            args.hourFinish == ""
          }
        >
          Comenzar
        </button>
      </form>
    </div>
  );
}

export default FormularioInicioDia;
