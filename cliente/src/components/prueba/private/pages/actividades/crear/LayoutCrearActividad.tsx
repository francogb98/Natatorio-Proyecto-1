import React, { useState } from "react";

import {
  fetchHours,
  postActivity,
} from "../../../../../../helpers/createActivity";

import {
  CheckboxForm,
  Formualario,
  InputPrueba,
  SelectPrueba,
} from "../../../components/Formulario-Actividad";
import { useMutation, useQuery } from "react-query";

const nombresActividades = [
  "pileta libre",
  "escuela de natacion adultos",
  "escuela de natacion niños",
];
const DiasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

function LayoutCrearActividad() {
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horario, setHorario] = useState<
    { hourStart: string; hourFinish: string } | undefined
  >({
    hourStart: "",
    hourFinish: "",
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["hours"],
    queryFn: fetchHours,
  });

  const createActivity = useMutation({
    mutationKey: "createActivity",
    mutationFn: postActivity,

    onSuccess: () => {
      alert("Actividad creada con exito");
    },
    onError: () => {
      alert("Error al crear la actividad");
    },
  });

  const handleChangeHorario = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("entre aqui");

    const selectedValue = JSON.parse(e.target.value);
    setHorario((prev) => ({
      ...prev,
      hourStart: selectedValue.hourStart,
      hourFinish: selectedValue.hourFinish,
    }));

    console.log(horario);
  };

  let handleChangeDias = (e: React.ChangeEvent<HTMLSelectElement>) => {
    !diasSeleccionados?.includes(e.target.value) &&
      e.target.value !== "" &&
      setDiasSeleccionados((prev) => [...prev, e.target.value]);
  };

  const [checkboxes, setCheckboxes] = useState({
    natacionAdaptada: false,
    actividadHabilitada: false,
    actividadEspecial: false,
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const object: any = {};
    data.forEach((value, key) => {
      object[key] = value;
    });
    object.date = diasSeleccionados;

    object.hourStart = horario?.hourStart;
    object.hourFinish = horario?.hourFinish;
    object.natacionAdaptada = checkboxes.natacionAdaptada;
    object.actividadHabilitada = checkboxes.actividadHabilitada;
    object.actividadEspecial = checkboxes.actividadEspecial;

    //sacar campo dias y horario
    delete object.dias;
    delete object.horario;

    console.log(object);

    createActivity.mutate(object);
  };

  if (isLoading) return <p>Cargando Horario...</p>;

  if (isSuccess)
    return (
      <div>
        <Formualario handleSubmit={handleSubmit} placeholder="Crear Actividad">
          <CheckboxForm
            name="natacionAdaptada"
            label="Natación Adaptada"
            checked={checkboxes.natacionAdaptada}
            onChange={handleCheckboxChange}
          />
          <CheckboxForm
            name="actividadHabilitada"
            label="Actividad Habilitada"
            checked={checkboxes.actividadHabilitada}
            onChange={handleCheckboxChange}
          />
          <CheckboxForm
            name="actividadEspecial"
            label="Actividad Especial"
            checked={checkboxes.actividadEspecial}
            onChange={handleCheckboxChange}
          />

          <SelectPrueba
            label="nombre actividad"
            name="name"
            defaultOption="--Actividad--"
            options={nombresActividades}
          />

          <div className="d-flex justify-content-between">
            <InputPrueba
              type="number"
              name="desde"
              placeholder="desde"
              label="desde"
            />
            <InputPrueba
              type="number"
              name="hasta"
              placeholder="hasta"
              label="hasta"
            />
          </div>
          <InputPrueba
            type="number"
            name="cupos"
            placeholder="cupos"
            label="cupos"
          />

          <SelectPrueba
            label="Dias"
            name="dias"
            defaultOption="--Dias--"
            options={DiasSemana}
            valueSelected={diasSeleccionados}
            setValueSelected={setDiasSeleccionados}
            handleChange={handleChangeDias}
          />
          <SelectPrueba
            label="horario"
            name="horario"
            defaultOption="--horario--"
            handleChange={handleChangeHorario}
          >
            {data.data.hours.map(
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
          </SelectPrueba>
          <SelectPrueba
            label="Pileta"
            name="pileta"
            defaultOption="--seleccione una pileta--"
            defaultValue="pileta 25"
            options={["pileta 25", "pileta 50"]}
          />
          <InputPrueba
            name="codigoDeAcceso"
            placeholder="codigoDeAcceso"
            label="codigoDeAcceso"
          />
          <button type="submit" className="btn btn-outline-success mt-3 w-100">
            Crear Actividad
          </button>
        </Formualario>
      </div>
    );
}

export { LayoutCrearActividad };
