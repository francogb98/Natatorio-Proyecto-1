import { Activity } from "../../../../models";
import { Hours } from "../../../helpers/hours";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface FormFilterActividadesProps {
  actividades: Activity[];
  setNombre: (nombre: string) => void;
  setDia: (dia: string) => void;
  setHorario: (horario: string) => void;
}

interface IHours {
  _id: string;
  hourStart: string;
  hourFinish: string;
}

function FormFilterActividades({
  actividades,
  setDia,
  setHorario,
  setNombre,
}: FormFilterActividadesProps) {
  const getHours = useQuery({
    queryKey: ["all_hours"],
    queryFn: Hours.getHours,
  });

  if (getHours.isLoading) return <div>Cargando horas...</div>;

  if (getHours.isSuccess && getHours.data) {
    let actividadesSinRepetir = [
      //@ts-ignore
      ...new Set(actividades.map((actividad) => actividad.name)),
    ].sort((a, b) => a.localeCompare(b));

    return (
      <div className="row my-2">
        <div className="col-4">
          <select
            className="form-select"
            id="exampleFormControlSelect1"
            onChange={(e) => setHorario(e.target.value)}
          >
            <option value={""}>-- Hora --</option>
            {getHours.data.hours.map((hour: IHours) => (
              <option key={hour._id} value={hour.hourStart}>
                {hour.hourStart} - {hour.hourFinish}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <select
            className="form-select"
            id="exampleFormControlSelect1"
            onChange={(e) => setNombre(e.target.value)}
          >
            <option value={""}>-- Actividades --</option>
            {actividadesSinRepetir.map((actividad, i) => (
              <option key={i} value={actividad}>
                {actividad}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <select
            className="form-select"
            id="exampleFormControlSelect1"
            onChange={(e) => setDia(e.target.value)}
          >
            <option value={""}>-- Dias --</option>
            <option value={"Lunes"}>Lunes</option>
            <option value={"Martes"}>Martes</option>
            <option value={"Miercoles"}>Miercoles</option>
            <option value={"Jueves"}>Jueves</option>
            <option value={"Viernes"}>Viernes</option>
          </select>
        </div>
      </div>
    );
  }
}

export default FormFilterActividades;
