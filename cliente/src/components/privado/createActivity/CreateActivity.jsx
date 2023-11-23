import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";

import { fetchHours, postActivity } from "../../../helpers/createActivity";
import Modal from "./Modal";

import style from "./style.module.css";

function CreateActivity() {
  const [nombresActividades, setNombresActividades] = useState([
    "pileta libre",
    "escuela de natacion adultos",
    "escuela de natacion niños",
  ]);

  const [args, setArgs] = useState({
    name: "",
    date: [],
    hourStart: "",
    hourFinish: "",
    desde: "",
    hasta: "",
    pileta: "",
    cupos: "",
    actividadEspecial: false,
  });

  const [isSpecialActivity, setIsSpecialActivity] = useState(false);

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
        if (!isSpecialActivity) {
          document.getElementById("hours").selectedIndex = 0;
        }
        document.getElementById("date").selectedIndex = 0;
        document.getElementById("pileta").selectedIndex = 0;

        //volver los valores de los inputs a default
        document.getElementById("name").value = "";
        if (isSpecialActivity) {
          document.getElementById("hourStart").value = "";
          document.getElementById("hourFinish").value = "";
        }
        document.getElementById("cupos").value = "";
        document.getElementById("desde").value = "";
        document.getElementById("hasta").value = "";

        //volver el checkbox a false
        document.getElementById("isSpecial").checked = false;

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

  const handleHorario = (e) => {
    //verifico que despues de los : haya solamente 2 caracteres
    const coincidencia = /:(.*)/.exec(e.target.value);

    if (coincidencia) {
      if (coincidencia[1].length > 2) {
        e.target.value = e.target.value.slice(0, 4);
      }
    }

    if (e.target.value.length > 5) {
      e.target.value = e.target.value.slice(0, 5);
    }
    if (e.target.value.length < 5) {
      setArgs({ ...args, [e.target.name]: "0" + e.target.value });
      return;
    }
    setArgs({ ...args, [e.target.name]: e.target.value });
  };

  //funcion para que cuando el usuario escriba en el input desde hasta, no pueda escribir mas de 2 caracteres

  useEffect(() => {}, [args, isSpecialActivity]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (isLoading) return <h1>Cargando...</h1>;

  data.data.hours.sort((a, b) => {
    if (a.hourStart < b.hourStart) {
      return -1;
    }
    if (a.hourStart > b.hourStart) {
      return 1;
    }
    return 0;
  });

  return (
    <div className={style.body}>
      {" "}
      <form action="" className={`form-group `} onSubmit={handleSubmit}>
        <div className={style.isSpecial}>
          <label htmlFor="isSpecial">Actividad Especial</label>
          <input
            type="checkbox"
            id="isSpecial"
            name="isSpecial"
            value={isSpecialActivity}
            onChange={(e) => {
              setIsSpecialActivity(e.target.checked);
              setArgs({ ...args, actividadEspecial: e.target.checked });
            }}
          />
        </div>

        <div>
          <label htmlFor="name">Actividad</label>
          {isSpecialActivity ? (
            <input
              type="text"
              id="name"
              name="name"
              value={args.name}
              className="form-control"
              onChange={(e) => {
                setArgs({ ...args, name: e.target.value });
              }}
            />
          ) : (
            <select
              id="name"
              name="name"
              className="form-select"
              defaultValue={args.name}
              onChange={(e) => {
                setArgs({ ...args, name: e.target.value });
              }}
            >
              <option value="">--Actividad--</option>
              {nombresActividades.map((actividad, i) => (
                <option value={actividad} key={i}>
                  {actividad}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="cupos">Edad</label>
          <div className="d-flex gap-2">
            <label htmlFor="">Desde</label>
            <input
              type="number"
              id="desde"
              name="desde"
              className="form-control"
              value={args.desde}
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2);
                }
                setArgs({ ...args, desde: e.target.value });
              }}
            />

            <label htmlFor="">Hasta</label>
            <input
              type="number"
              id="hasta"
              name="hasta"
              className="form-control"
              value={args.hasta}
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2);
                }
                setArgs({ ...args, hasta: e.target.value });
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cupos">Cupos</label>
          <input
            type="number"
            id="cupos"
            name="cupos"
            value={args.cupos}
            className="form-control"
            onChange={(e) => {
              setArgs({ ...args, cupos: e.target.value });
            }}
          />
        </div>

        {/* horario */}
        {!isSpecialActivity ? (
          <div>
            <label htmlFor="dni" className={`form-label  mt-2`}>
              Horario
            </label>
            <select
              className="form-select"
              name="hours"
              id="hours"
              defaultValue="null"
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
        ) : (
          <div>
            <label htmlFor="hourStart">Horario Ingreso</label>
            <input
              type="text"
              id="hourStart"
              name="hourStart"
              className="form-control"
              onChange={handleHorario}
              placeholder="08:00"
            />
            <label htmlFor="hourFinish">Horario Salida</label>
            <input
              type="text"
              id="hourFinish"
              name="hourFinish"
              className="form-control"
              onChange={handleHorario}
              placeholder="10:00"
            />
          </div>
        )}

        <div>
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
        <div>
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
          data-bs-toggle="modal"
          data-bs-target="#modalCreateActivity"
        >
          {" "}
          Crear Actividad
        </button>
      </form>
      <Modal args={args} createActivity={createActivity} />
    </div>
  );
}

export default CreateActivity;
