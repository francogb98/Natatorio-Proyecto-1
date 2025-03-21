import React, { useState } from "react";
import { useMutation } from "react-query";

import { buscar_piletas } from "../helpers/fetch.pileta";
import TablaPileta from "../components/TablaPileta";

import { Pileta } from "../../../../models";
import { capitalizeFirstLetter } from "../../../utils/CapitalizeFirstLetter";

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

function BuscarPileta() {
  const [formData, setFormData] = useState({
    dia: "",
    hora: horarios[0], // Establecer el primer horario como valor predeterminado
  });

  const buscar = useMutation({
    mutationFn: buscar_piletas,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [year, month, day] = formData.dia.split("-");
    const formattedDate = `${day}/${month}/${year}`; // Convertir a DD/MM/YYYY

    buscar.mutate({ ...formData, dia: formattedDate });
  };

  return (
    <div>
      <div className="row">
        <h3 className="text-center">Buscar Turno</h3>
        <form action="" className="d-flex mt-3 gap-1" onSubmit={handleSubmit}>
          <input
            type="date"
            name="dia"
            value={formData.dia}
            onChange={handleChange}
            className="form-control"
          />
          <select
            id="horariosSelect"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            className="form-select"
          >
            {horarios.map((hora, i) => (
              <option key={i} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-success"
            disabled={!formData.dia || !formData.hora}
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="row">
        {buscar.isLoading && (
          <div className="alert alert-info text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Buscando Turno...</p>
          </div>
        )}
        {buscar.isSuccess && buscar.data && (
          <div>
            {!buscar.data.pileta ? (
              <div className="alert alert-warning my-3 text-center fw-bold">
                No se encontraron piletas en este turno
              </div>
            ) : (
              <>
                {buscar.data.pileta.map((pileta: Pileta) => (
                  <div className="my-3" key={pileta._id}>
                    <h3>{capitalizeFirstLetter(pileta.pileta)}</h3>
                    {!pileta.users ? (
                      <div className="alert alert-info text-center">
                        No se encontraron usuarios registrados en este turno
                      </div>
                    ) : (
                      <TablaPileta users={pileta.users} />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { BuscarPileta };
