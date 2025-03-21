import React, { useState } from "react";
import { useQuery } from "react-query";
import { ActividadesFetch } from "../../../../../../helpers/activitiesFetch/Actividades-fetch-class";
import TablaActividadesItem from "./TablaActividadesItem";
import FormFilterActividades from "./FormFilterActividades";
import { Activity } from "../../../../models";

function ListaActividades() {
  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");

  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: ActividadesFetch.getActivities,
  });

  if (getActivity.isLoading) return <div>Cargando Actividades...</div>;

  if (getActivity.isError) return <div>Error al cargar las actividades</div>;

  if (getActivity.isSuccess && getActivity.data) {
    const { actividades } = getActivity.data;
    let actividadesFiltradas = actividades;

    if (nombre == "" && dia == "" && horario == "") {
    }
    if (nombre != "") {
      actividadesFiltradas = actividadesFiltradas.filter(
        (actividad: Activity) => actividad.name == nombre
      );
    }
    if (dia != "") {
      actividadesFiltradas = actividadesFiltradas.filter(
        (actividad: Activity) => actividad.date.includes(dia)
      );
    }
    if (horario != "") {
      actividadesFiltradas = actividadesFiltradas.filter(
        (actividad: Activity) => actividad.hourStart == horario
      );
    }

    return (
      <div>
        <h2 className="text-center mb-3">Lista de actividades</h2>
        <FormFilterActividades
          actividades={actividades}
          setNombre={setNombre}
          setDia={setDia}
          setHorario={setHorario}
        />
        <TablaActividadesItem actividades={actividadesFiltradas} />
      </div>
    );
  }
}

export { ListaActividades };
