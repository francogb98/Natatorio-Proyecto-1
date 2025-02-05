import React, { useState } from "react";

import { useMutation } from "react-query";
import { buscar_piletas } from "../../helpers/busacr_pileta";
import TablaPrueba from "../Pileta";
import { Link } from "react-router-dom";

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

function Layout() {
  const [formData, setFormData] = useState({
    dia: "",
    hora: horarios[0], // Establecer el primer horario como valor predeterminado
  });

  const buscar = useMutation({
    mutationFn: buscar_piletas,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "dia") {
      const data = value.split("-");
      value = `${data[2]}/${data[1]}/${data[0]}`;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    buscar.mutate(formData);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "customid",
    },
    {
      header: "Nombre y Apellido",
      accessorKey: "apellido",
      cell: ({ row }) => (
        <Link
          to={`/usuario/${row.original.customid}`}
        >{`${row.original.nombre}`}</Link>
      ),
    },
    {
      header: "Actividad",
      accessorKey: "actividad",
      cell: ({ row }) => <div>{row.original.actividad}</div>,
    },
    {
      header: "Salida",
      accessorKey: "eliminar",
      cell: ({ row }) => <p>{row.original.horarioSalida}</p>,
    },
  ];

  return (
    <div>
      <div className="row">
        <form action="" className="d-flex mt-3" onSubmit={handleSubmit}>
          <input
            type="date"
            name="dia"
            value={formData.date}
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
            className="btn btn-primary"
            disabled={!formData.dia || !formData.hora}
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="row my-3">
        {buscar.isLoading && (
          <div
            className="d-block mx-auto spinner-border text-primary"
            role="status"
          ></div>
        )}

        {buscar.data && buscar.data.status == "success" && (
          <div>
            {buscar.data.pileta.map((pileta) => {
              if (pileta.pileta !== "turnoSiguiente") {
                return (
                  <div key={pileta._id}>
                    <h2 className="text-center fw-bold">
                      {pileta.pileta.charAt(0).toUpperCase() +
                        pileta.pileta.slice(1)}
                    </h2>
                    <TablaPrueba data={pileta.users} columns={columns} />
                  </div>
                );
              }
            })}
          </div>
        )}

        {buscar.data?.status == "error" && (
          <div className="px-4">
            <div className="text-center alert alert-info text-danger fw-bold">
              No se encontraron piletas
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Layout };
