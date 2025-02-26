import React from "react";

import { CardActividad } from "../../components/Actividades";
import { Actividad } from "../../models";

interface ActividadProps {
  actividades: Actividad[];
}

function ActividadesLista({ actividades }: ActividadProps) {
  //TRAE TODAS LAS ACTIVIDADES

  return (
    <div className="row mt-3 justify-content-around g-1">
      {actividades.map((actividad) => (
        <div key={actividad._id} className="col-6 col-lg-3 p-3">
          <CardActividad actividad={actividad} />
        </div>
      ))}
    </div>
  );
}

export default ActividadesLista;
