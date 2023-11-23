import React from "react";

import style from "./styleFormulario.module.css";

function InformacionUsuario({ setUsuario, usuario, esMenor }) {
  return (
    <div>
      <div className="mb-2">
        <label htmlFor="Nombre">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          className="form-control"
          onChange={(e) => {
            setUsuario({ ...usuario, nombre: e.target.value });
          }}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="Nombre">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={usuario.apellido}
          className="form-control"
          onChange={(e) => {
            setUsuario({ ...usuario, apellido: e.target.value });
          }}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="Dni">Dni</label>
        <input
          type="text"
          name="dni"
          value={usuario.dni}
          className="form-control"
          onChange={(e) => {
            setUsuario({ ...usuario, dni: e.target.value });
          }}
        />
      </div>

      {!esMenor && usuario.natacionAdaptada === "no" && (
        <>
          <div className="mb-2">
            <label htmlFor="telefono">Telefono</label>
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              className="form-control"
              onChange={(e) => {
                setUsuario({ ...usuario, telefono: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="telefonoContacto" className={`form-label  mt-2 `}>
              Telefono De Contacto
            </label>
            <input
              type="text"
              name="telefonoContacto"
              className="form-control"
              id="telefonoContacto"
              onChange={(e) => {
                setUsuario({ ...usuario, telefonoContacto: e.target.value });
              }}
              value={usuario.telefonoContacto}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              onChange={(e) => {
                setUsuario({ ...usuario, email: e.target.value });
              }}
              value={usuario.email}
            />
          </div>
        </>
      )}

      <div className="mb-2">
        <label htmlFor="dni" className={`form-label  mt-2`}>
          Sexo
        </label>
        <select
          className="form-select"
          name="sexo"
          id="sexo"
          onChange={(e) => {
            setUsuario({ ...usuario, sexo: e.target.value });
          }}
          defaultValue={usuario.sexo}
        >
          <option value="null">--Sexo--</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    </div>
  );
}

export default InformacionUsuario;
