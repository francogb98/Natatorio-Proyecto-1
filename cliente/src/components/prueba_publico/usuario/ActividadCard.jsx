import React from "react";
import editar_datos from "../funciones_usuario/editar_datos.hook";

import { toast } from "sonner";

function ActividadCard({ actividad, user }) {
  const { darDeBaja } = editar_datos();

  return (
    <div>
      <p>
        Nombre: <span>{actividad.name}</span>
      </p>
      <p>
        Dias: <span>{actividad.date.join(" - ")}</span>
      </p>
      <p>
        Horario:
        <span>
          {actividad.hourStart} - {actividad.hourFinish}
        </span>
      </p>
      <p>
        Estado: <span>{user.status ? "Aprobado" : "Pendiente"}</span>
      </p>
      <p>
        Asistencia: <span> {user.asistencia.join(" - ")}</span>
      </p>
      <button
        className="btn btn-danger"
        onClick={() => {
          toast.info("Dando de baja actividad");
          darDeBaja.mutate(actividad._id);
        }}
      >
        Dar de baja
      </button>
    </div>
  );
}

export default ActividadCard;
