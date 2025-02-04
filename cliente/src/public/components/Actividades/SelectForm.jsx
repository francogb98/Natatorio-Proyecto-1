import React from "react";
import { fetchConTokenHours } from "../../../helpers/fetch";
import { useQuery } from "react-query";

import style from "./style.module.css";

function SelectForm({ nombreActividades, handleFilter }) {
  const getHours = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
    refetchOnWindowFocus: false,
  });

  if (getHours.data)
    return (
      <div className={`${style.select__body}`}>
        <select
          className={`form-select ${style.select__data}`}
          name="name"
          onChange={handleFilter}
        >
          <option value="default">--Nombre--</option>
          {nombreActividades.map((actividad, i) => (
            <option key={i} value={actividad}>
              {actividad}
            </option>
          ))}
        </select>

        <select
          className={`form-select ${style.select__data}`}
          name="hour"
          onChange={handleFilter}
        >
          <option value="default">--Horario--</option>
          {getHours.data.data.hours.map((hour) => (
            <option key={hour._id} value={hour.hourStart}>
              {hour.hourStart} - {hour.hourFinish}
            </option>
          ))}
        </select>

        <select
          className={`form-select ${style.select__data}`}
          name="day"
          onChange={handleFilter}
        >
          <option value="default">--Día--</option>
          {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"].map(
            (day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            )
          )}
        </select>
      </div>
    );
}

export default SelectForm;
