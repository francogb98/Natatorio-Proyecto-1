import React from "react";

import style from "./style.module.css";

function InformacionPersonal({
  formValues,
  handleInputChange,
  edicionActiva,
  setEdicionActiva,
  handleSubmitAdulto,
  setMenorEdadAlert,
  menorEdadAlert,
}) {
  return (
    <>
      <form action="">
        <div className={style.info}>
          <label htmlFor="">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formValues.apellido}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Telefono</label>
          <input
            type="text"
            name="telefono"
            value={formValues.telefono}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={formValues.ciudad}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Barrio</label>
          <input
            type="text"
            name="barrio"
            value={formValues.barrio}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Edad</label>
          <input
            type="number"
            name="edad"
            value={formValues.edad}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">DNI</label>
          <input
            type="number"
            name="dni"
            value={formValues.dni}
            onChange={handleInputChange}
            className="form-control"
            disabled={!edicionActiva}
          />
        </div>
      </form>

      {!menorEdadAlert ? (
        <div className={style.info}>
          <button
            className="btn btn-danger"
            onClick={() => {
              setEdicionActiva(!edicionActiva);
            }}
          >
            {edicionActiva ? "Cancelar" : "Editar"}
          </button>
          {edicionActiva && (
            <button className="btn btn-success" onClick={handleSubmitAdulto}>
              Guardar
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}

export default InformacionPersonal;
