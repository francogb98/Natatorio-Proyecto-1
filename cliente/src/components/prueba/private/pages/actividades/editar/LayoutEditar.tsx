import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Activity } from "../../../../models/index";
import { toast } from "sonner";
import { baseUrl } from "../../../../../../helpers/url";

async function getActividad(id: string) {
  const token = localStorage.getItem("token");
  const resp = await fetch(baseUrl + "activity/getActividad/" + id, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: token || "",
    },
  });

  if (!resp.ok) {
    throw new Error("Error al obtener la actividad");
  }

  return await resp.json();
}

async function updateActividad({
  id,
  data,
}: {
  id: string;
  data: Partial<Activity>;
}) {
  const token = localStorage.getItem("token");
  const resp = await fetch(baseUrl + "activity/editaractividad", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: token || "",
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error("Error al actualizar la actividad");
  }

  return await resp.json();
}

function LayoutEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actividad, setActividad] = useState<Partial<Activity>>({});
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["actividad", id],
    queryFn: () => getActividad(id!),
    onSuccess: (data) => {
      setActividad(data.actividad);
      setDiasSeleccionados(data.actividad.date || []);
    },
  });

  const updateMutation = useMutation(updateActividad, {
    onSuccess: () => {
      toast.success("Actividad actualizada correctamente");
      navigate(-1); // Volver a la página anterior
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setActividad((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setActividad((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!actividad || !id) return;

    const actividadActualizada = {
      ...actividad,
      date: diasSeleccionados,
    };

    delete actividadActualizada.users;

    updateMutation.mutate({ id, data: actividadActualizada });
  };

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3">Cargando actividad...</span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Error al cargar la actividad: {(error as Error).message}
      </div>
    );

  if (!actividad) return null;
  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>
            Editar Actividad
          </h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Sección de Configuración */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Configuración Básica</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre de la Actividad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={actividad.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Edad Mínima</label>
                      <input
                        type="number"
                        className="form-control"
                        name="desde"
                        value={actividad.desde || ""}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Edad Máxima</label>
                      <input
                        type="number"
                        className="form-control"
                        name="hasta"
                        value={actividad.hasta || ""}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cupos Disponibles</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cupos"
                      value={actividad.cupos || ""}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Código de Acceso</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codigoDeAcceso"
                      value={actividad.codigoDeAcceso || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Opciones */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Opciones de Actividad</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Días de la Semana</label>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        "Lunes",
                        "Martes",
                        "Miercoles",
                        "Jueves",
                        "Viernes",
                      ].map((dia) => (
                        <div key={dia} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`dia-${dia}`}
                            checked={diasSeleccionados.includes(dia)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDiasSeleccionados([
                                  ...diasSeleccionados,
                                  dia,
                                ]);
                              } else {
                                setDiasSeleccionados(
                                  diasSeleccionados.filter((d) => d !== dia)
                                );
                              }
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`dia-${dia}`}
                          >
                            {dia}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pileta</label>
                    <select
                      className="form-select"
                      name="pileta"
                      value={actividad.pileta || ""}
                      onChange={(e) =>
                        setActividad({ ...actividad, pileta: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Seleccione una pileta --</option>
                      <option value="pileta 25">Pileta 25m</option>
                      <option value="pileta 50">Pileta 50m</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="natacionAdaptada"
                        checked={!!actividad.natacionAdaptada}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "natacionAdaptada",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="natacionAdaptada"
                      >
                        Natación Adaptada
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="actividadHabilitada"
                        checked={!!actividad.actividadHabilitada}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "actividadHabilitada",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="actividadHabilitada"
                      >
                        Actividad Habilitada
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="actividadEspecial"
                        checked={!!actividad.actividadEspecial}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "actividadEspecial",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="actividadEspecial"
                      >
                        Actividad Especial
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="col-12">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-x-lg me-1"></i> Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { LayoutEditar };
