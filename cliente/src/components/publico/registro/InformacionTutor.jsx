import React from "react";

import style from "./styleFormulario.module.css";

function InformacionTutor({ setUsuario, usuario, handleDni, handleTelefono }) {
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
          type="number"
          name="dniTutor"
          className="form-control"
          id="dniTutor"
          placeholder="38568955"
          onChange={handleDni}
          value={usuario.dniTutor}
        />
        <label htmlFor="emailTutor" className={`form-label  mt-2 `}>
          Email Del Tutor
        </label>
        <input
          type="email"
          name="emailTutor"
          className="form-control"
          id="emailTutor"
          placeholder="correo@gmail.com"
          onChange={(e) => {
            setUsuario({ ...usuario, emailTutor: e.target.value });
          }}
          value={usuario.emailTutor}
        />
        <label htmlFor="telefonoTutor" className={`form-label  mt-2 `}>
          Telefono Del Tutor
        </label>

        <input
          type="number"
          name="telefonoTutor"
          className="form-control"
          id="telefonoTutor"
          placeholder="3856895566"
          onChange={handleTelefono}
          value={usuario.telefonoTutor}
        />

        <label htmlFor="telefonoContacto" className={`form-label  mt-2 `}>
          Telefono De Contacto
        </label>
        <input
          type="number"
          name="telefonoContacto"
          className="form-control"
          id="telefonoContacto"
          placeholder="3856895566"
          onChange={handleTelefono}
          value={usuario.telefonoContacto}
        />
      </div>
    </div>
  );
}

export default InformacionTutor;
