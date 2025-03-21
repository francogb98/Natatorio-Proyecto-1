import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import {
  CheckboxForm,
  Formualario,
  InputPrueba,
  SelectPrueba,
} from "../../../components/Formulario-Actividad";
import { Activity } from "../../../../models/index";

const baseUrl = "http://localhost:4000/activity/getActividad/";

async function getActividad(id: string) {
  const token = localStorage.getItem("token");
  const resp = await fetch(baseUrl + id, {
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

function LayoutEditar() {
  const { id } = useParams();
  const [actividad, setActividad] = useState<Activity | null>(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string>("");

  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ["actividad", id],
    queryFn: () => getActividad(id!),
  });

  // Cargar datos cuando estén disponibles
  useEffect(() => {
    if (isSuccess && data?.actividad) {
      setActividad(data.actividad);
      setDiasSeleccionados(data.actividad.date || []);
    }
  }, [data, isSuccess]);

  if (isLoading) return <h1>Cargando...</h1>;
  if (error) return <h1>Error al cargar la actividad</h1>;
  if (!actividad) return null;

  // Manejo de cambios en checkboxes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setActividad((prev) => (prev ? { ...prev, [name]: checked } : prev));
  };
  const handleInputChange = (name: string, value: string) => {
    setActividad((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Manejo de cambios en los días seleccionados
  const handleChangeDias = (selectedDias: string[]) => {
    setDiasSeleccionados(selectedDias);
  };

  // Manejo de cambios en el horario
  const handleChangeHorario = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHorarioSeleccionado(event.target.value);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //acceder a los valores de los inputs
    const data = new FormData(e.target as HTMLFormElement);
    const object: any = {};
    data.forEach((value, key) => {
      object[key] = value;
    });

    console.log("Datos de   l formulario:", object);

    actividad.date = diasSeleccionados;

    console.log("Actividad a enviar:", actividad);

    //actualizar el campo actividad

    // Aquí puedes hacer la petición para actualizar la actividad en el backend
  };

  return (
    <div>
      <Formualario handleSubmit={handleSubmit} placeholder="Editar Actividad">
        <CheckboxForm
          name="natacionAdaptada"
          label="Natación Adaptada"
          checked={actividad.natacionAdaptada}
          onChange={handleCheckboxChange}
        />
        <CheckboxForm
          name="actividadHabilitada"
          label="Actividad Habilitada"
          checked={actividad.actividadHabilitada}
          onChange={handleCheckboxChange}
        />
        <CheckboxForm
          name="actividadEspecial"
          label="Actividad Especial"
          checked={actividad.actividadEspecial}
          onChange={handleCheckboxChange}
        />

        <InputPrueba
          name="name"
          placeholder="nombre"
          label="nombre"
          defaultValue={actividad.name}
        />

        <div className="d-flex justify-content-between">
          <InputPrueba
            type="number"
            name="desde"
            placeholder="desde"
            label="desde"
            defaultValue={actividad.desde}
          />
          <InputPrueba
            type="number"
            name="hasta"
            placeholder="hasta"
            label="hasta"
            defaultValue={actividad.hasta}
          />
        </div>

        <InputPrueba
          type="number"
          name="cupos"
          placeholder="cupos"
          label="cupos"
          defaultValue={actividad.cupos}
        />

        <SelectPrueba
          label="Días"
          name="dias"
          defaultOption="--Días--"
          options={["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]}
          valueSelected={diasSeleccionados}
          setValueSelected={setDiasSeleccionados}
        />

        {/* <SelectPrueba
          label="Horario"
          name="horario"
          defaultOption="--Seleccione un horario--"
          handleChange={handleChangeHorario}
        >
          {data.data.hours.map(
            (hour: { _id: string; hourStart: string; hourFinish: string }) => (
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
        </SelectPrueba> */}

        <SelectPrueba
          label="Pileta"
          name="pileta"
          defaultOption="--Seleccione una pileta--"
          defaultValue="pileta 25"
          options={["pileta 25", "pileta 50"]}
        />

        <InputPrueba
          name="codigoDeAcceso"
          placeholder="Código de Acceso"
          label="Código de Acceso"
          defaultValue={actividad.codigoDeAcceso}
        />

        <button type="submit" className="btn btn-outline-success mt-3 w-100">
          Guardar Cambios
        </button>
      </Formualario>
    </div>
  );
}

export { LayoutEditar };
