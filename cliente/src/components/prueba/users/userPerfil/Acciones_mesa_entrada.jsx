import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import Funciones_administrador, {
  getActividades,
} from "../hooks/Funciones_administrador";

function Acciones_mesa_entrada({ user }) {
  const [accion, setAccion] = useState("");
  const [ejecutarAccion, setEjecutarAccion] = useState(false);

  const [idActividad, setIdActividad] = useState(null);
  const [listaActividades, setActividadesLista] = useState([]);

  useEffect(() => {}, [accion, ejecutarAccion]);

  const {
    cambiar,
    inhabilitar,
    habilitar,
    eliminarNotificacion,
    enviarNotificacion,
    agregar_usuario_actividad,
  } = Funciones_administrador();

  return (
    <div className="row mb-4 border">
      <h2 className="text-center ">Acciones Administrador</h2>
      <div className="col-6">
        

        {user.activity?.length ? (
          <>
            <label className="fw-bold">Actividad:</label>
            <div className="d-flex justify-content-around mb-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  habilitar.mutate({ id: user._id });
                }}
              >
                Habilitar
              </button>
             
            </div>
          </>
        ) : null}
        
      </div>
      <div className="col-6 border-start">
        {ejecutarAccion && (
          <div>
            {accion == "inhabilitar" && (
              <div className="text-center">
                <h5>Inhabilitar Usuario</h5>

                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    if (
                      !formData.get("asunto").trim() ||
                      !formData.get("cuerpo").trim()
                    ) {
                      toast.error("Por favor, completa ambos campos.");
                      return;
                    }
                    const content = {
                      id: user._id,
                      asunto: formData.get("asunto"),
                      cuerpo: formData.get("cuerpo"),
                    };
                    toast.info("Inhabilitando Usuario");
                    inhabilitar.mutate(content);
                  }}
                >
                  <div className="d-flex flex-column align-items-start mb-2">
                    <label htmlFor="" className="form-label">
                      Asunto
                    </label>
                    <input className="form-control" name="asunto" />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label htmlFor="" className="form-label">
                      Cuerpo
                    </label>
                    <input className="form-control" name="cuerpo" />
                  </div>

                  <button
                    className="btn my-2"
                    style={{
                      background: "rgb(250,0,0,0.6)",
                      color: "white",
                    }}
                  >
                    Inhabilitar
                  </button>
                </form>
              </div>
            )}
            {accion == "agregar_actividad" && (
              <div className="text-center">
                <h5>Agregar a Actividad</h5>

                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();

                    const content = {
                      id: user.customId,
                      actividad: idActividad,
                    };
                    toast.info("Agregando usuario a la actividad");
                    agregar_usuario_actividad.mutate(content);
                  }}
                >
                  <label className="fw-bold">Cambiar Rol:</label>
                  <select
                    name=""
                    id=""
                    style={{ maxWidth: "100%" }}
                    onChange={(e) => {
                      setIdActividad(e.target.value);
                    }}
                    defaultValue={user.role}
                    className="form-select mb-2"
                  >
                    <option value="SUPER_ADMIN">
                      --Seleccionar Actividad--
                    </option>
                    {listaActividades.map((actividad) => (
                      <option key={actividad._id} value={actividad._id}>
                        {actividad.name} | ({actividad.hourStart}-
                        {actividad.hourFinish}) | ({actividad.date.join(" - ")})
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn my-2"
                    style={{
                      background: "greenYellow",
                    }}
                  >
                    Agregar
                  </button>
                </form>
              </div>
            )}
            {accion == "enviar_notificacion" && (
              <div className="text-center">
                <h5>Enviar Notificacion</h5>

                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    if (
                      !formData.get("asunto").trim() ||
                      !formData.get("cuerpo").trim()
                    ) {
                      toast.error("Por favor, completa ambos campos.");
                      return;
                    }
                    const content = {
                      id: user._id,
                      asunto: formData.get("asunto"),
                      cuerpo: formData.get("cuerpo"),
                    };
                    toast.info("Enviando mensaje");
                    enviarNotificacion.mutate(content);
                  }}
                >
                  <div className="d-flex flex-column align-items-start mb-2">
                    <label htmlFor="" className="form-label">
                      Asunto
                    </label>
                    <input className="form-control" name="asunto" />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label htmlFor="" className="form-label">
                      Cuerpo
                    </label>
                    <input className="form-control" name="cuerpo" />
                  </div>

                  <button
                    className="btn my-2"
                    style={{
                      background: "greenYellow",
                    }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default Acciones_mesa_entrada;