import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";

import { fetchHours, postActivity } from "../../../helpers/createActivity";

function CreateActivity() {
  const [args, setArgs] = useState({
    name: "",
    date: [],
    hourStart: "",
    hourFinish: "",
    pileta: "",
    cupos: "",
  });

  // traemos los horarios disponibles
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: "hours",
    queryFn: fetchHours,
  });

  const createActivity = useMutation({
    mutationKey: "createActivity",
    mutationFn: postActivity,
    onSuccess: (data) => {
      if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      } else if (data.status === "success") {
        setArgs({
          name: "",
          date: [],
          hourStart: "",
          hourFinish: "",
          pileta: "",
          cupos: "",
        });

        //volver los valores de los select a default
        document.getElementById("name").value = "";
        document.getElementById("hours").selectedIndex = 0;
        document.getElementById("date").selectedIndex = 0;
        document.getElementById("pileta").selectedIndex = 0;
        Swal.fire({
          icon: "success",
          title: "Actividad creada",
          text: data.message,
        });
      }
    },
  });

  const handleChange = (e) => {
    const selectedValue = JSON.parse(e.target.value); // Parse the JSON string
    setArgs({
      ...args,
      hourStart: selectedValue.hourStart,
      hourFinish: selectedValue.hourFinish,
    });
  };
  const handleDay = (e) => {
    setArgs({ ...args, date: [...args.date, e.target.value] });
  };

  useEffect(() => {}, [args]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createActivity.mutate(args);
  };

  if (isLoading) return <h1>Cargando...</h1>;

  return (
    <div
      style={{
        padding: "30px",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      <form
        action=""
        className={`form-group `}
        style={{
          width: "360px",
          backgroundColor: "white",
          padding: "20px",
          color: "black",
          fontSize: "20px",
        }}
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <label htmlFor="name">Nombre Actividad</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            onChange={(e) => {
              setArgs({ ...args, name: e.target.value });
            }}
            placeholder="pileta libre, escuela de natacion..."
          />
        </div>
        <div className="mb-2">
          <label htmlFor="cupos">Cupos</label>
          <input
            type="number"
            id="cupos"
            name="cupos"
            className="form-control"
            onChange={(e) => {
              setArgs({ ...args, cupos: e.target.value });
            }}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="dni" className={`form-label  mt-2`}>
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

        <div className="mb-2">
          <label htmlFor="dni" className={`form-label  mt-2`}>
            Pileta
          </label>
          <select
            className="form-select"
            name="pileta"
            id="pileta"
            onChange={(e) => setArgs({ ...args, pileta: e.target.value })}
          >
            <option value="null">--Pileta--</option>
            <option value="pileta 25">Pileta 25</option>
            <option value="pileta 50">Pileta 50</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="dni" className={`form-label  mt-2`}>
            Dias
          </label>
          <select
            className="form-select"
            name="date"
            id="date"
            onChange={(e) => handleDay(e)}
          >
            <option value="null">--Dias--</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miercoles">Miercoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            fontSize: "12px",
            marginLeft: "20px",
          }}
        >
          {args.date.length > 0 &&
            args.date.map((day, i) => (
              <p key={i}>
                {day}{" "}
                <span
                  onClick={() => {
                    setArgs({
                      ...args,
                      date: args.date.filter((d) => d !== day),
                    });
                  }}
                  style={{
                    cursor: "pointer",
                    border: "1px solid black",
                  }}
                >
                  X
                </span>{" "}
              </p>
            ))}
        </div>

        {createActivity.isLoading && <h4>Creando actividad...</h4>}

        <button
          type="submit"
          value="Iniciar Sesion"
          className="mt-2 btn btn-primary"
        >
          {" "}
          Crear Actividad
        </button>
      </form>
    </div>
  );
}

export default CreateActivity;
