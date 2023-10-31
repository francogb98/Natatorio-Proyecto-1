import React from "react";
import Barrio from "./Barrio";

function UbicacionYContacto({ setUsuario, usuario }) {
  return (
    <div>
      <div className="mb-2">
        <label htmlFor="Telefono">Telefono</label>
        <input
          type="text"
          name="telefono"
          className="form-control"
          placeholder="3855666899..."
          onChange={(e) => {
            setUsuario({ ...usuario, telefono: e.target.value });
          }}
          value={usuario.telefono}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="TelefonoContacto">TelefonoContacto</label>
        <input
          type="text"
          name="telefonoContacto"
          className="form-control"
          placeholder="3852366239..."
          onChange={(e) => {
            setUsuario({ ...usuario, telefonoContacto: e.target.value });
          }}
          value={usuario.telefonoContacto}
        />
      </div>

      <Barrio setUsuario={setUsuario} usuario={usuario} />
    </div>
  );
}

export default UbicacionYContacto;
