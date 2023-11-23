import React from "react";
import Barrio from "./Barrio";

function UbicacionYContacto({ setUsuario, usuario }) {
  return (
    <div>
      <Barrio setUsuario={setUsuario} usuario={usuario} />
    </div>
  );
}

export default UbicacionYContacto;
