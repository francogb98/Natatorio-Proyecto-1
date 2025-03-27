import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Funciones_administrador, {
  getActividades,
} from "../hooks/Funciones_administrador";

function Acciones_administrador({ user }) {
  const [accion, setAccion] = useState("");
  const [idActividad, setIdActividad] = useState(null);
  const [listaActividades, setActividadesLista] = useState([]);

  const { cambiar, habilitar, enviarNotificacion, agregar_usuario_actividad } =
    Funciones_administrador();

  const roles = [
    { value: "SUPER_ADMIN", label: "Super Administrador" },
    { value: "ADMINISTRATIVO", label: "Administrativo" },
    { value: "GUARDAVIDA", label: "Guardavidas" },
    { value: "PROFESOR", label: "Profesor" },
    { value: "usuario", label: "Usuario" },
  ];

  const handleAgregarActividad = async () => {
    setAccion("agregar_actividad");
    const respuesta = await getActividades();
    setActividadesLista(respuesta.actividades);
  };

  const handleSubmitNotificacion = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const asunto = formData.get("asunto")?.toString().trim();
    const cuerpo = formData.get("cuerpo")?.toString().trim();

    if (!asunto || !cuerpo) {
      toast.error("Por favor, completa ambos campos.");
      return;
    }

    toast.info("Enviando mensaje");
    enviarNotificacion.mutate({
      content: { id: user._id, asunto, cuerpo },
      id: user._id,
    });
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary bg-opacity-10 border-0">
        <h3 className="mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-gear-fill"></i>
          Acciones de Administrador
        </h3>
      </div>

      <div className="card-body">
        <div className="row g-4">
          {/* Columna izquierda - Acciones principales */}
          <div className="col-md-6">
            <div className="d-grid gap-3">
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                onClick={() => setAccion("enviar_notificacion")}
              >
                <i className="bi bi-send-fill"></i>
                Enviar Notificación
              </button>

              {user.activity?.length > 0 && (
                <button
                  className="btn btn-success d-flex align-items-center justify-content-center gap-2"
                  onClick={() => habilitar.mutate({ id: user._id })}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  Habilitar Usuario
                </button>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-person-badge"></i>
                  Cambiar Rol
                </label>
                <select
                  onChange={(e) => {
                    toast.info("Cambiando rol...");
                    cambiar.mutate({
                      id: user._id,
                      role: e.target.value,
                    });
                  }}
                  defaultValue={user.role}
                  className="form-select"
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map((rol) => (
                    <option key={rol.value} value={rol.value}>
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
                onClick={handleAgregarActividad}
              >
                <i className="bi bi-plus-circle-fill"></i>
                Agregar a Actividad
              </button>
            </div>
          </div>

          {/* Columna derecha - Formularios de acción */}
          <div className="col-md-6 border-start">
            {accion === "agregar_actividad" && (
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center gap-2">
                    <i className="bi bi-calendar-plus"></i>
                    Agregar a Actividad
                  </h5>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!idActividad) {
                        toast.error("Selecciona una actividad");
                        return;
                      }
                      toast.info("Agregando usuario...");
                      agregar_usuario_actividad.mutate({
                        idActividad,
                        id: user._id,
                      });
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label">
                        Seleccionar Actividad
                      </label>
                      <select
                        className="form-select"
                        onChange={(e) => setIdActividad(e.target.value)}
                        required
                      >
                        <option value="">-- Seleccionar --</option>
                        {listaActividades.map((actividad) => (
                          <option key={actividad._id} value={actividad._id}>
                            {actividad.name} ({actividad.hourStart}-
                            {actividad.hourFinish})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-check-lg"></i>
                      Confirmar
                    </button>
                  </form>
                </div>
              </div>
            )}

            {accion === "enviar_notificacion" && (
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center gap-2">
                    <i className="bi bi-chat-left-text"></i>
                    Nueva Notificación
                  </h5>

                  <form onSubmit={handleSubmitNotificacion}>
                    <div className="mb-3">
                      <label className="form-label">Asunto</label>
                      <input
                        name="asunto"
                        className="form-control"
                        placeholder="Título de la notificación"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mensaje</label>
                      <textarea
                        name="cuerpo"
                        className="form-control"
                        rows={4}
                        placeholder="Contenido del mensaje..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-send-fill"></i>
                      Enviar Notificación
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default Acciones_administrador;
