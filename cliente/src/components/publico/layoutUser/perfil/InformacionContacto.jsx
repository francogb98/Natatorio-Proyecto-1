import React from "react";

import style from "./style.module.css";

function InformacionContacto({
  formValues,
  handleInputChange,
  edicionActiva,
  setEdicionActiva,
  handleSubmitMenor,
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
            name="nombreTutor"
            value={formValues.nombreTutor}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Apellido</label>
          <input
            type="text"
            name="apellidoTutor"
            value={formValues.apellidoTutor}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="emailTutor"
            value={formValues.emailTutor}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Telefono</label>
          <input
            type="text"
            name="telefonoTutor"
            value={formValues.telefonoTutor}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Telefono</label>
          <input
            type="text"
            name="dniTutor"
            className="form-control"
            value={formValues.dniTutor}
            onChange={handleInputChange}
            disabled={!edicionActiva}
          />
        </div>
      </form>

      <div className={style.info}>
        <button
          className="btn btn-danger"
          onClick={() => {
            setMenorEdadAlert(false);

            setEdicionActiva(!edicionActiva);
          }}
        >
          {edicionActiva ? "Cancelar" : "Editar"}
        </button>
        {edicionActiva && (
          <button className="btn btn-success" onClick={handleSubmitMenor}>
            Guardar
          </button>
        )}
      </div>
    </>
  );
}

export default InformacionContacto;
