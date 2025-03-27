import { useMutation } from "react-query";
import { UserFetchPrivado } from "../../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";
import React, { useState } from "react";
import { toast } from "sonner";

function AnalizarFichaMedica({
  imagen,
  placeholder,
  customId,
}: {
  imagen: string;
  placeholder: string;
  customId: number;
}) {
  const [error, setError] = useState("");
  const [observacion, setObservacion] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState("null");

  const mutation = useMutation({
    mutationFn: UserFetchPrivado.enviarRevisionArchivo,
    onSuccess: () => {
      toast.success("Revisión enviada correctamente");
      setObservacion("");
      setArchivoSeleccionado("null");
    },
    onError: () => {
      toast.error("Error al enviar la revisión");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (archivoSeleccionado === "null") {
      setError("Por favor seleccione el archivo a revisar");
      return;
    }

    if (observacion.trim() === "") {
      setError("Por favor ingrese una observación");
      return;
    }

    const fecha = new Date();
    fecha.setDate(fecha.getDate());
    const formattedFecha = fecha.toLocaleDateString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const notificacion = {
      asunto: `Revisión requerida para ${archivoSeleccionado}`,
      cuerpo: `${observacion}\n\nSi en los próximos 30 días no se realiza la revisión, se procederá a la baja de la actividad.\n\nAtte: Administración`,
      fecha: formattedFecha,
    };

    mutation.mutate({ notificacion, customId });
  };

  const opcionesArchivo = [
    { value: "null", label: "-- Archivo a revisar --", disabled: true },
    { value: "Ficha Médica", label: "Ficha Médica" },
    {
      value: "Certificado de Pediculosis y Micosis",
      label: "Certificado de PyM",
    },
    { value: "DNI", label: "DNI" },
    { value: "Foto de Perfil", label: "Foto de Perfil" },
  ];

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary bg-opacity-10 border-0">
        <h4 className="mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-file-earmark-medical"></i>
          {placeholder}
        </h4>
      </div>

      <div className="card-body">
        {/* Visualización del documento */}
        <div className="document-viewer mb-4">
          {imagen ? (
            <div
              className="border rounded-3 p-3 bg-light"
              style={{ maxHeight: "70vh", overflow: "auto" }}
            >
              <img
                src={imagen}
                alt={`Documento ${placeholder}`}
                className="img-fluid rounded shadow-sm d-block mx-auto"
                style={{ maxWidth: "100%" }}
              />
            </div>
          ) : (
            <div className="text-center py-4 bg-light rounded-3">
              <i
                className="bi bi-file-earmark-excel text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <p className="text-muted mt-2">Documento no disponible</p>
            </div>
          )}
        </div>

        {/* Formulario de observaciones */}
        <div className="observations-form">
          <h5 className="mb-3 text-center d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-chat-square-text"></i>
            Observaciones
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="archivo" className="form-label small text-muted">
                Seleccione archivo a revisar
              </label>
              <select
                id="archivo"
                className={`form-select ${
                  archivoSeleccionado === "null" ? "is-invalid" : ""
                }`}
                value={archivoSeleccionado}
                onChange={(e) => {
                  setArchivoSeleccionado(e.target.value);
                  setError("");
                }}
              >
                {opcionesArchivo.map((opcion) => (
                  <option
                    key={opcion.value}
                    value={opcion.value}
                    disabled={opcion.disabled}
                  >
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label
                htmlFor="observacion"
                className="form-label small text-muted"
              >
                Detalle de observaciones
              </label>
              <textarea
                className={`form-control ${
                  observacion.trim() === "" && error ? "is-invalid" : ""
                }`}
                id="observacion"
                rows={4}
                value={observacion}
                onChange={(e) => {
                  setObservacion(e.target.value);
                  setError("");
                }}
                placeholder="Ingrese las observaciones sobre el documento..."
              ></textarea>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-3">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i>
                  Enviar a revisión
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnalizarFichaMedica;
