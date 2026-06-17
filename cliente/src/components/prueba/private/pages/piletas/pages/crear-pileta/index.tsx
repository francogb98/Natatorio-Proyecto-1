import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { baseUrl } from "../../../../../../../helpers/url";

const horarios = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

async function crearPileta(data: { pileta: string; dia: string; hora: string }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${baseUrl}pileta/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token || "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear la pileta");
  }

  return res.json();
}

function CrearPileta() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    pileta: "",
    dia: "",
    hora: horarios[0],
  });

  const crear = useMutation({
    mutationFn: crearPileta,
    onSuccess: () => {
      toast.success("Pileta creada correctamente");
      queryClient.invalidateQueries(["piletas"]);
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Error al crear la pileta");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [year, month, day] = formData.dia.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    crear.mutate({ ...formData, dia: formattedDate });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Crear Pileta</h3>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pileta" className="form-label">
                Nombre de la Pileta
              </label>
              <input
                type="text"
                className="form-control"
                id="pileta"
                name="pileta"
                value={formData.pileta}
                onChange={handleChange}
                placeholder="Ej: Pileta 1"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dia" className="form-label">
                Día
              </label>
              <input
                type="date"
                className="form-control"
                id="dia"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="hora" className="form-label">
                Horario
              </label>
              <select
                className="form-select"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              >
                {horarios.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={crear.isLoading || !formData.pileta || !formData.dia}
              >
                {crear.isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Creando...
                  </>
                ) : (
                  "Crear Pileta"
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { CrearPileta };
