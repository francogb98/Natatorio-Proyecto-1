import { baseUrl } from "../../../helpers/url";
import { useQuery } from "react-query";
import CardActividad from "./CardActividad";
import { fetchConTokenHours } from "../../../helpers/fetch";
import { useEffect, useState } from "react";
import ActividadConClave from "../../publico/layoutUser/inscripcion/ActividadConClave";

export const getActividades = async () => {
  try {
    const url = `${baseUrl}activity/getAllUsuarios`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await resp.json();

    return data;
  } catch (error) {
    return error;
  }
};

function Actividades_lista() {
  const [actividadRegistrarse, setActividadRegistrarse] = useState(null);

  useEffect(() => {}, [actividadRegistrarse]);

  const [actividades, setActivitys] = useState([]); // <---quiero que se ordene por horario
  const [nombreActividades, setNombreActivitys] = useState([]); // <---quiero que se ordene por horario
  const [hours, setHours] = useState([]);
  const [idDelete, setIdDelete] = useState(null);
  const [filter, setFilter] = useState({
    name: "default",
    hour: "default",
    day: "default",
  });
  const days = [
    { id: "a", name: "Lunes" },
    { id: "b", name: "Martes" },
    { id: "c", name: "Miercoles" },
    { id: "d", name: "Jueves" },
    { id: "e", name: "Viernes" },
  ];
  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: getActividades,
  });
  const getHours = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
  });

  useEffect(() => {
    if (getActivity.data && getHours.data?.data) {
      const sortedActivities = getActivity.data.activity.sort((a, b) => {
        const dateA = new Date(`1970-01-01T${a.hourStart}`);
        const dateB = new Date(`1970-01-01T${b.hourStart}`);
        return dateA - dateB;
      });
      setActivitys(sortedActivities);
      const uniqueNames = new Set(
        getActivity.data.activity.map((actividad) => {
          if (actividad.natacionAdaptada) {
            return actividad.name + " adaptada";
          } else {
            return actividad.name;
          }
        })
      );

      setNombreActivitys([...uniqueNames]);
      setHours(
        getHours.data.data.hours.sort((a, b) =>
          a.hourStart.localeCompare(b.hourStart)
        )
      );
    }
  }, [getActivity.data, getHours.data]);

  if (getActivity.isLoading && getHours.isLoading) {
    return (
      <main className="container">
        <div className="row text-center mt-2">
          <h1>Nuestras Actividades</h1>
        </div>

        <div className="row">
          {actividades.isLoading && (
            <h1 className="col-12">Cargando Actividades</h1>
          )}
        </div>
      </main>
    );
  }

  if (getActivity.data && getHours.data?.data) {
    const handleFilter = (e) => {
      const value = e.target.value;
      const name = e.target.name;

      setFilter((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    };

    const filteredActivities = actividades.filter((actividad) => {
      return Object.entries(filter).every(([key, value]) => {
        if (value === "default") return true;

        if (key === "day") {
          return actividad.date.includes(value);
        }

        if (key === "hour") {
          return actividad.hourStart === value;
        }

        if (key === "name") {
          return actividad.name === value;
        }

        return true;
      });
    });

    return (
      <main className="container mb-5">
        <div className="row text-center mt-2">
          <h1>Nuestras Actividades</h1>
        </div>
        <div className="container-fluid">
          <h4 className="ps-2">Filtrar actividades</h4>
          <div className="row mb-3 px-1">
            <div className="col-4">
              <select
                type="text"
                placeholder="Horario"
                className="form-select"
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
            </div>
            {/* quiero que el input de horario sea un select con todas las opciones disponibles en hours*/}
            <div className="col-4">
              <select
                type="text"
                placeholder="Horario"
                className="form-select"
                name="hour"
                onChange={handleFilter}
              >
                <option value="default">--Horario--</option>
                {hours.map((hour) => (
                  <option key={hour._id} value={hour.hourStart}>
                    {hour.hourStart} - {hour.hourFinish}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <select
                type="text"
                placeholder="Horario"
                className="form-select"
                name="day"
                onChange={handleFilter}
              >
                <option value="default">--Dias--</option>
                {days.map((day) => (
                  <option key={day.id} value={day.name}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            {filteredActivities.map((actividad) => (
              <div
                className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
                key={actividad._id}
              >
                <CardActividad
                  actividad={actividad}
                  actividadRegistrarse={actividadRegistrarse}
                  setActividadRegistrarse={setActividadRegistrarse}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <ActividadConClave />
        </div>
      </main>
    );
  }
}

export default Actividades_lista;
