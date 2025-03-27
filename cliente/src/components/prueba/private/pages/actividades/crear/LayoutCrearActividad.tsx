import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  fetchHours,
  postActivity,
} from "../../../../../../helpers/createActivity";
import { toast } from "sonner";

const nombresActividades = [
  "pileta libre",
  "escuela de natacion adultos",
  "escuela de natacion niños",
];

const DiasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

function LayoutCrearActividad() {
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horario, setHorario] = useState<{
    hourStart: string;
    hourFinish: string;
  } | null>(null);
  const [checkboxes, setCheckboxes] = useState({
    natacionAdaptada: false,
    actividadHabilitada: false,
    actividadEspecial: false,
  });

  const {
    data: hoursData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hours"],
    queryFn: fetchHours,
  });

  const createActivity = useMutation({
    mutationFn: postActivity,
    onSuccess: () => {
      toast.success("Actividad creada con éxito");
      // Resetear formulario después de éxito
      setDiasSeleccionados([]);
      setHorario(null);
      setCheckboxes({
        natacionAdaptada: false,
        actividadHabilitada: false,
        actividadEspecial: false,
      });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la actividad: ${error.message}`);
    },
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDaySelection = (dia: string) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!horario) {
      toast.warning("Por favor seleccione un horario");
      return;
    }

    if (diasSeleccionados.length === 0) {
      toast.warning("Por favor seleccione al menos un día");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const activityData = {
      name: formData.get("name") as string,
      desde: parseInt(formData.get("desde") as string) || 0,
      hasta: parseInt(formData.get("hasta") as string) || 0,
      cupos: parseInt(formData.get("cupos") as string) || 0,
      pileta: formData.get("pileta") as string,
      codigoDeAcceso: formData.get("codigoDeAcceso") as string,
      date: diasSeleccionados,
      hourStart: horario.hourStart,
      hourFinish: horario.hourFinish,
      ...checkboxes,
    };

    createActivity.mutate(activityData);
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
        <span className="ms-3">Cargando horarios disponibles...</span>
      </div>
    );

  if (isError)
    return (
      <div className="alert alert-danger text-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Error al cargar los horarios disponibles
      </div>
    );

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Crear Nueva Actividad
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
                    <label className="form-label">
                      Nombre de la Actividad*
                    </label>
                    <select className="form-select" name="name" required>
                      <option value="">-- Seleccione una actividad --</option>
                      {nombresActividades.map((actividad) => (
                        <option key={actividad} value={actividad}>
                          {actividad}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Edad Mínima*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="desde"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Edad Máxima*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="hasta"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cupos Disponibles*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cupos"
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pileta*</label>
                    <select className="form-select" name="pileta" required>
                      <option value="">-- Seleccione una pileta --</option>
                      <option value="pileta 25">Pileta 25m</option>
                      <option value="pileta 50">Pileta 50m</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Horarios y Opciones */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Horarios y Opciones</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Días de la Semana*</label>
                    <div className="d-flex flex-wrap gap-2">
                      {DiasSemana.map((dia) => (
                        <div key={dia} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`dia-${dia}`}
                            checked={diasSeleccionados.includes(dia)}
                            onChange={() => handleDaySelection(dia)}
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
                    {diasSeleccionados.length === 0 && (
                      <small className="text-danger">
                        Seleccione al menos un día
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Horario*</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const selected = JSON.parse(e.target.value);
                        setHorario(selected);
                      }}
                      required
                    >
                      <option value="">-- Seleccione un horario --</option>
                      {hoursData?.data.hours.map(
                        (hour: {
                          _id: string;
                          hourStart: string;
                          hourFinish: string;
                        }) => (
                          <option
                            value={JSON.stringify({
                              hourStart: hour.hourStart,
                              hourFinish: hour.hourFinish,
                            })}
                            key={hour._id}
                          >
                            {hour.hourStart} - {hour.hourFinish}
                          </option>
                        )
                      )}
                    </select>
                    {horario && (
                      <div className="mt-2">
                        <span className="badge bg-primary">
                          Horario seleccionado: {horario.hourStart} -{" "}
                          {horario.hourFinish}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Código de Acceso</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codigoDeAcceso"
                      placeholder="Opcional"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="natacionAdaptada"
                        name="natacionAdaptada"
                        checked={checkboxes.natacionAdaptada}
                        onChange={handleCheckboxChange}
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
                        name="actividadHabilitada"
                        checked={checkboxes.actividadHabilitada}
                        onChange={handleCheckboxChange}
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
                        name="actividadEspecial"
                        checked={checkboxes.actividadEspecial}
                        onChange={handleCheckboxChange}
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
                  onClick={() => window.history.back()}
                >
                  <i className="bi bi-x-lg me-1"></i> Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createActivity.isLoading}
                >
                  {createActivity.isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i> Crear Actividad
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

export { LayoutCrearActividad };
