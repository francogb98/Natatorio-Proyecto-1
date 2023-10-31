import React from "react";

import style from "./styleFormulario.module.css";

function InformacionUsuario({ setUsuario, usuario }) {
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
        <label>Usuaripo para Natacion Adaptada</label>
        <select
          name=""
          id=""
          className="form-select"
          onChange={(e) => {
            setUsuario({ ...usuario, natacionAdaptada: e.target.value });
          }}
          defaultValue={usuario.natacionAdaptada}
        >
          <option value="">Seleccione una opcion</option>
          <option value="no">No</option>
          <option value="si">Si</option>
        </select>
      </div>
    </div>
  );
}

export default InformacionUsuario;
