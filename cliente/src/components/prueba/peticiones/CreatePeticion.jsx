import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { peticiones } from "../../../helpers/Peticiones/peticiones.helpers";
import { ActividadesFetch } from "../../../helpers/activitiesFetch/Actividades-fetch-class";

function CreatePeticion({ user, handleSolicitar }) {
  const actividades = useQuery({
    queryKey: ["actividades"],
    queryFn: ActividadesFetch.getActivities,
  });

  const [asunto, setAsunto] = useState("inscribir");
  const [actividad, setActividad] = useState("");
  const [activityBaja, setActivityBaja] = useState("");
  const [motivo, setMotivo] = useState("");

  const peticion = useMutation({
    mutationFn: peticiones.createPeticion,
    onSuccess: (data) => {
      if (data.status === "error") {
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
        setActividad("");
        setActivityBaja("");
        setMotivo("");
      }
    },
  });

  const handleChange = (e) => {
    setAsunto(e.target.value);
  };
  const handleActividad = (e) => {
    setActividad(e.target.value);
  };
  const handleactivityBaja = (e) => {
    setActivityBaja(e.target.value);
  };
  const handleMotivo = (e) => {
    setMotivo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = {
      asunto,
      activityBaja,
      motivo,
    };

    if (!actividad && !activityBaja) {
      toast.error("Por favor completar todos los campos");
      return;
    }

    peticion.mutate({
      userId: user._id,
      actividadId: actividad ? actividad : activityBaja,
      content,
    });
  };

  return (
    <div className="p-2">
      <h4 className="text-center">
        {user.nombre} {user.apellido}
      </h4>
      <p className="fs-5">Crear solicitud:</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="asunto">
            <b>Asunto</b>
          </label>
          <select
            className="form-select"
            name="asunto"
            id="asunto"
            onChange={handleChange}
          >
            <option value="null">--seleccione un asunto--</option>
            <option value="inscribir">Inscribir en actividad</option>
            <option value="baja">Dar de baja en actividad</option>
            <option value="cambiar">Cambiar Actividad</option>
          </select>
        </div>

        {actividades.isLoading && <p>Cargando...</p>}
        {asunto !== "baja" && actividades.isSuccess && (
          <div className="mb-2">
            <label htmlFor="asunto">
              <b>Actividad a inscribir</b>
            </label>
            <select
              className="form-select"
              name="sexo"
              id="sexo"
              onChange={handleActividad}
            >
              <option value="null">---Seleccione una actividad---</option>
              {actividades.data.actividades.map((actividad) => (
                <option key={actividad._id} value={actividad._id}>
                  {actividad.name} | {actividad.hourStart} -{" "}
                  {actividad.hourFinish} | {actividad.date.join(" - ")}
                </option>
              ))}
            </select>
          </div>
        )}
        {asunto !== "inscribir" && (
          <div className="mb-2">
            <label htmlFor="asunto">
              <b>Actividad a dar de baja</b>
            </label>
            <select
              className="form-select"
              name="sexo"
              id="sexo"
              onChange={handleactivityBaja}
            >
              <option value="null">---Seleccione una actividad---</option>
              {user.activity.map((actividad) => (
                <option key={actividad._id} value={actividad._id}>
                  {actividad.name} | {actividad.hourStart} -{" "}
                  {actividad.hourFinish} | {actividad.date.join(" - ")}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="d-flex flex-column mb-3">
          <label htmlFor="motivo">
            <b>Motivo</b>
          </label>
          <textarea
            name="motivo"
            id="motivo"
            placeholder=" (opcional)"
            onChange={handleMotivo}
          ></textarea>
        </div>

        {peticion.isLoading && (
          <div
            className="d-block spinner-border text-primary mb-3 mx-auto"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-sm btn-primary" onClick={handleSolicitar}>
            {" "}
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={peticion.isLoading}
          >
            solicitar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePeticion;
