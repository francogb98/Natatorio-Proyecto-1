// BuscarUsuariosForm.js
import React from "react";

import style from "./inicio.module.css";

function BuscarUsuariosForm({
  args,
  setArgs,
  handleChange,
  idUser,
  setIdUser,
  onSubmit,
  loading,
  error,
  data,
}) {
  return (
    <form onSubmit={onSubmit} style={{ padding: "40px" }}>
      <div className={style.selectInput} style={{ gap: "20px" }}>
        <div className="mb-2">
          <label htmlFor="dni" className={`form-label`}>
            Dia
          </label>
          <select
            className="form-select"
            name="date"
            id="date"
            onChange={(e) => {
              setArgs({ ...args, date: e.target.value });
            }}
            value={args.date}
          >
            <option value="null">--Dia--</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miercoles">Miercoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
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
        {/* slect del turno */}
      </div>
      <div>
        <h3>Insertar Id Usuario</h3>
        <input
          type="text"
          name="id"
          id="id"
          value={idUser}
          className="form-control"
          onChange={(e) => {
            setIdUser(e.target.value);
            setArgs({ ...args, idUser: e.target.value });
          }}
        />
      </div>

      {loading && (
        <div className="spinner-border text-primary mt-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {error.error && (
        <>
          <h3>{error.msg}</h3>
        </>
      )}
      <button type="submit" className="btn btn-lg btn-success mt-3">
        Buscar
      </button>
    </form>
  );
}

export default BuscarUsuariosForm;
