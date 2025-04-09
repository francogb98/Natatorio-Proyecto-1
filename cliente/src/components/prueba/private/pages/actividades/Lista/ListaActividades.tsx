import React, { useState } from "react";
import { useQuery } from "react-query";
import { ActividadesFetch } from "../../../../../../helpers/activitiesFetch/Actividades-fetch-class";
import TablaActividadesItem from "./TablaActividadesItem";
import FormFilterActividades from "./FormFilterActividades";
import { Activity } from "../../../../models";
import { set } from "date-fns";

function ListaActividades() {
  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");

  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
  });

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
        <div className="d-flex justify-content-end mt-3">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${
                  paginacion.page == 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  tabIndex={-1}
                  onClick={() => {
                    setPaginacion({ ...paginacion, page: paginacion.page - 1 });
                  }}
                >
                  Anterior
                </button>
              </li>
              {Array.from({
                length: Math.ceil(
                  actividadesFiltradas.length / paginacion.limit
                ),
              }).map((_, index) => (
                <li
                  className={`page-item ${
                    paginacion.page == index + 1 ? "active" : ""
                  }`}
                  key={index}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      setPaginacion({ ...paginacion, page: index + 1 });
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  paginacion.page ==
                  Math.ceil(actividadesFiltradas.length / paginacion.limit)
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => {
                    setPaginacion({ ...paginacion, page: paginacion.page + 1 });
                  }}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <TablaActividadesItem
          actividades={actividadesFiltradas.slice(
            (paginacion.page - 1) * paginacion.limit,
            paginacion.page * paginacion.limit
          )}
        />
      </div>
    );
  }
}

export { ListaActividades };
