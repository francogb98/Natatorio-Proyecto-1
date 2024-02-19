import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";

import { fetchHours } from "../../../../helpers/createActivity";

import style from "../createActivity/style.module.css";

import { editarActividad } from "../../../../helpers/activitiesFetch/editarActividad";

function EditarActividad({ actividad }) {
  const [nombresActividades, setNombresActividades] = useState([
    "pileta libre",
    "escuela de natacion adultos",
    "escuela de natacion niños",
  ]);

  const [args, setArgs] = useState({
    name: actividad ? actividad.name : "",
    date: actividad ? actividad.date : [],
    hourStart: actividad ? actividad.hourStart : "",
    hourFinish: actividad ? actividad.hourFinish : "",
    pileta: actividad ? actividad.pileta : "",
    cupos: actividad ? actividad.cupos : "",
    actividadEspecial: actividad ? actividad.actividadEspecial : false,
    desde: actividad ? actividad.desde : "",
    hasta: actividad ? actividad.hasta : "",
    natacionAdaptada: actividad ? actividad.natacionAdaptada : "",

    codigoDeAcceso: actividad.codigoDeAcceso ?? "",
    actividadHabilitada: actividad.actividadHabilitada ?? true,
  });

  const [isSpecialActivity, setIsSpecialActivity] = useState(
    actividad ? actividad.actividadEspecial : false
  );

  // traemos los horarios disponibles
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: "hours",
    queryFn: fetchHours,
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

  const queryClient = useQueryClient();

  const handleEditar = useMutation({
    mutationKey: "editarActividad",
    mutationFn: editarActividad,
    onSuccess: (data) => {
      if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      } else if (data.status === "success") {
        queryClient.invalidateQueries("activitys");

        Swal.fire({
          icon: "success",
          title: "Actividad editada con exito",
          text: data.message,
        });
      }
    },
  });

  return (
    <div className={style.body}>
      {" "}
      <form action="" className={`form-group `} onSubmit={handleSubmit}>
        <section
          style={{
            display: "flex",
          }}
        >
          <div className={style.isSpecial}>
            <label htmlFor="isSpecial">Actividad Habilitada</label>
            <input
              type="checkbox"
              id="isHability"
              name="isHability"
              checked={args.actividadHabilitada}
              value={args.actividadHabilitada}
              onChange={(e) => {
                setArgs({ ...args, actividadHabilitada: e.target.checked });
              }}
            />
          </div>
          <div className={style.isSpecial}>
            <label htmlFor="isSpecial">Actividad Especial</label>
            <input
              type="checkbox"
              id="isSpecial"
              name="isSpecial"
              checked={args.actividadEspecial}
              value={isSpecialActivity}
              onChange={(e) => {
                setIsSpecialActivity(e.target.checked);
                setArgs({ ...args, actividadEspecial: e.target.checked });
              }}
            />
          </div>
          <div className={style.isSpecial}>
            <label htmlFor="isSpecial">Natacion Adaptada</label>
            <input
              type="checkbox"
              id="isSpecial"
              name="isSpecial"
              checked={args.natacionAdaptada}
              value={args.natacionAdaptada}
              onChange={(e) => {
                setArgs({ ...args, natacionAdaptada: e.target.checked });
              }}
            />
          </div>
        </section>

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
              value={args.hourStart}
              className="form-control"
              onChange={(e) => setArgs({ ...args, hourStart: e.target.value })}
              placeholder="08:00"
            />
            <label htmlFor="hourFinish">Horario Salida</label>
            <input
              type="text"
              id="hourFinish"
              name="hourFinish"
              value={args.hourFinish}
              className="form-control"
              onChange={(e) => setArgs({ ...args, hourFinish: e.target.value })}
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
            defaultValue={args.pileta}
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
            <option value="Miércoles">Miércoles</option>
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

        <div>
          <label htmlFor="cupos">Codigo de Acceso</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={args.codigoDeAcceso}
            className="form-control"
            onChange={(e) => {
              setArgs({ ...args, codigoDeAcceso: e.target.value });
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-2 btn btn-primary"
          onClick={() => {
            handleEditar.mutate({ args, id: actividad._id });
          }}
        >
          {" "}
          Editar Actividad
        </button>
      </form>
    </div>
  );
}

export default EditarActividad;
