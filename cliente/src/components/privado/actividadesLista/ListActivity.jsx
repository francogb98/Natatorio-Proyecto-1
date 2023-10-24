import React, { useEffect, useState } from "react";
import { fetchConToken, fetchConTokenHours } from "../../../helpers/fetch";
import { useQuery, useMutation } from "react-query";
import Modal from "./ModalActivity";

import { deleteActivity } from "../../../helpers/activitiesFetch/deleteActivity";

function ListActivity() {
  const [actividades, setActivitys] = useState([]); // <---quiero que se ordene por horario
  const [nombreActividades, setNombreActivitys] = useState([]); // <---quiero que se ordene por horario
  const [hours, setHours] = useState([]);
  const [idDelete, setIdDelete] = useState(null);
  const [filter, setFilter] = useState({
    name: "default",
    hour: "default",
    day: "default",
  });
  const [days, setDays] = useState([
    { id: "a", name: "Lunes" },
    { id: "b", name: "Martes" },
    { id: "c", name: "Miercoles" },
    { id: "d", name: "Jueves" },
    { id: "e", name: "Viernes" },
  ]);
  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: fetchConToken,
  });
  const getHours = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
  });

  const deleteAct = useMutation(deleteActivity, {
    onSuccess: () => {
      getActivity.refetch();
    },
  });
  useEffect(() => {
    if (getActivity.data?.data && getHours.data?.data) {
      const sortedActivities = getActivity.data.data.activity.sort((a, b) => {
        const dateA = new Date(`1970-01-01T${a.hourStart}`);
        const dateB = new Date(`1970-01-01T${b.hourStart}`);
        return dateA - dateB;
      });
      setActivitys(sortedActivities);
      const uniqueNames = new Set(
        getActivity.data.data.activity.map((actividad) => actividad.name)
      );

      setNombreActivitys([...uniqueNames]);
      setHours(getHours.data.data.hours);
    }
  }, [getActivity.data, getHours.data]);

  if (getActivity.isLoading || getHours.isLoading) return <h1>Cargando...</h1>;

  if (getActivity.isError || getHours.isError)
    return <h1>Hubo un error al cargar las actividades</h1>;

  if (getActivity.data?.data && getHours.data?.data) {
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

    const deleteActivity = () => {
      deleteAct.mutate({ id: idDelete });
    };

    return (
      <div>
        <h1 className="my-4" style={{ textAlign: "center" }}>
          Lista Actividades
        </h1>
        <div>
          <h2>Filtrar actividades</h2>
          <div className="d-flex justify-content-evenly mb-2">
            <select
              type="text"
              placeholder="Horario"
              className="form-select"
              style={{ width: "fit-content" }}
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

            {/* quiero que el input de horario sea un select con todas las opciones disponibles en hours*/}

            <select
              type="text"
              placeholder="Horario"
              className="form-select"
              name="hour"
              onChange={handleFilter}
              style={{ width: "fit-content" }}
            >
              <option value="default">--Horario--</option>
              {hours.map((hour) => (
                <option key={hour.id} value={hour.hourStart}>
                  {hour.hourStart} - {hour.hourFinish}
                </option>
              ))}
            </select>
            <select
              type="text"
              placeholder="Horario"
              className="form-select"
              name="day"
              onChange={handleFilter}
              style={{ width: "fit-content" }}
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
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="bg-primary text-white fw-bold">Horario</th>
              <th>Nombre</th>
              <th>Dias</th>
              <th>Cupos</th>
              <th>Usuarios Registrados</th>
              <th>Disponibles</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay actividades
                </td>
              </tr>
            )}
            {filteredActivities.map((actividad) => (
              <tr key={actividad._id}>
                <td className="bg-primary text-white fw-bold">
                  {actividad.hourStart} - {actividad.hourFinish}
                </td>
                <td>{actividad.name}</td>
                <td>{actividad.date.join(" - ")}</td>
                <td>{actividad.cupos}</td>
                <td>{actividad.users.length}</td>
                <td>{actividad.cupos - actividad.users.length}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modalDelete"
                    onClick={() => setIdDelete(actividad._id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal deleteActivity={deleteActivity} />
      </div>
    );
  }
}

export default ListActivity;
