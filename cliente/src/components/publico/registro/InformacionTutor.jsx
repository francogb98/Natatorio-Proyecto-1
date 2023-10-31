import React from "react";

import style from "./styleFormulario.module.css";

function InformacionTutor({ setUsuario, usuario }) {
  return (
    <div>
      <div className={`${style.formularioTutor}`}>
        <label htmlFor="nombreTutor" className={`form-label  mt-2`}>
          Nombre Del Tutor
        </label>
        <input
          type="text"
          name="nombreTutor"
          className="form-control"
          id="nombreTutor"
          onChange={(e) => {
            setUsuario({ ...usuario, nombreTutor: e.target.value });
          }}
          value={usuario.nombreTutor}
        />
        <label htmlFor="nombreTutor" className={`form-label  mt-2`}>
          Apellido Del Tutor
        </label>
        <input
          type="text"
          name="apellidoTutor"
          className="form-control"
          id="apellidoTutor"
          onChange={(e) => {
            setUsuario({ ...usuario, apellidoTutor: e.target.value });
          }}
          value={usuario.apellidoTutor}
        />

        <label htmlFor="dniTutor" className={`form-label  mt-2 `}>
          Dni Del Tutor
        </label>
        <input
          type="text"
          name="dniTutor"
          className="form-control"
          id="dniTutor"
          onChange={(e) => {
            setUsuario({ ...usuario, dniTutor: e.target.value });
          }}
          value={usuario.dniTutor}
        />
      </div>
    </div>
  );
}

export default InformacionTutor;
