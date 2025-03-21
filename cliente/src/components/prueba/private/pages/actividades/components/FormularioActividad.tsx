import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";

import {
  fetchHours,
  postActivity,
} from "../../../../../../helpers/createActivity";

import style from "./style.module.css";
import Modal from "./Modal";

interface ActivityArgs {
  name: string;
  date: string[];
  hourStart: string;
  hourFinish: string;
  desde: string;
  hasta: string;
  pileta: string;
  cupos: string;
  actividadEspecial: boolean;
  natacionAdaptada: boolean;
  codigoDeAcceso: string;
  actividadHabilitada: boolean;
}

const FormularioActividad: React.FC = () => {
  const [nombresActividades] = useState<string[]>([
    "pileta libre",
    "escuela de natacion adultos",
    "escuela de natacion niños",
  ]);

  const [args, setArgs] = useState<ActivityArgs>({
    name: "",
    date: [],
    hourStart: "",
    hourFinish: "",
    desde: "",
    hasta: "",
    pileta: "",
    cupos: "",
    actividadEspecial: false,
    natacionAdaptada: false,
    codigoDeAcceso: "",
    actividadHabilitada: true,
  });

  const [isSpecialActivity, setIsSpecialActivity] = useState<boolean>(false);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["hours"],
    queryFn: fetchHours,
  });

  const createActivity = useMutation({
    mutationKey: ["createActivity"],
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
          desde: "",
          hasta: "",
          pileta: "",
          cupos: "",
          actividadEspecial: false,
          natacionAdaptada: false,
          codigoDeAcceso: "",
          actividadHabilitada: true,
        });

        Swal.fire({
          icon: "success",
          title: "Actividad creada",
          text: data.message,
        });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = JSON.parse(e.target.value);
    setArgs((prev) => ({
      ...prev,
      hourStart: selectedValue.hourStart,
      hourFinish: selectedValue.hourFinish,
    }));
  };

  const handleDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArgs((prev) => ({ ...prev, date: [...prev.date, e.target.value] }));
  };

  const handleHorario = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const match = /:(.*)/.exec(value);

    if (match && match[1].length > 2) {
      value = value.slice(0, 4);
    }

    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setArgs((prev) => ({ ...prev, [e.target.name]: value }));
  };

  useEffect(() => {}, [args, isSpecialActivity]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (isLoading) return <h1>Cargando...</h1>;
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
              {data.data.hours.map(
                (hour: {
                  _id: string;
                  hourStart: string;
                  hourFinish: string;
                }) => (
                  <option
                    value={JSON.stringify({
                      hourStart: hour.hourStart,
                      hourFinish: hour.hourFinish,
                    })}
                    key={hour._id}
                  >
                    {hour.hourStart} - {hour.hourFinish}
                  </option>
                )
              )}
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
};

export default FormularioActividad;
