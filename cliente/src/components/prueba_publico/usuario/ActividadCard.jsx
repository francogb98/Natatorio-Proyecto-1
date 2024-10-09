import React, { useContext } from "react";

import { toast } from "sonner";
import { useMutation } from "react-query";
import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";
import { AuthContext } from "../../../context/AuthContext";

function ActividadCard({ actividad, user }) {
  const { userRefetch } = useContext(AuthContext);

  const darDeBaja = useMutation({
    mutationFn: UserFetch.darDeBajaActividad,
    onSuccess: (data) => {
      toast.success("Informacion actualizada");
      userRefetch();
    },
    onError: () => {
      toast.error("Error en el servidor");
      userRefetch();
    },
  });

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
      {/* <p>
        Asistencia: <span> {user.asistencia.join(" - ")}</span>
      </p> */}
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
