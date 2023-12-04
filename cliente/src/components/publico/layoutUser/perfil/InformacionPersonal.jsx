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
        {!menorEdadAlert ? (
          <div className={style.info}>
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.preventDefault();
                setEdicionActiva(!edicionActiva);
              }}
            >
              {edicionActiva ? (
                "Cancelar"
              ) : (
                <div className="text-light">
                  Editar <i class="bi bi-pencil ms-2"></i>
                </div>
              )}
            </button>
            {edicionActiva && (
              <button className="btn btn-success" onClick={handleSubmitAdulto}>
                Guardar
              </button>
            )}
          </div>
        ) : null}
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
          <label htmlFor="">Telefono de emergencia</label>
          <input
            type="text"
            name="telefonoContacto"
            value={formValues.telefonoContacto}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control "
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
    </>
  );
}

export default InformacionPersonal;
