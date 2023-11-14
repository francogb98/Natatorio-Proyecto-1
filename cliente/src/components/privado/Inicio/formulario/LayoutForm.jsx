import React, { useEffect, useState } from "react";
import FormularioPrueba from "./FormularioPrueba";
import FormularioTurnoSiguiente from "./FormularioTurnoSiguiente";
import useDiaYHoraActual from "../UseDay";

import style from "./layout.module.css";

function LayoutForm({ socket, setCargando, userList }) {
  const { horaActual, diaActualEnEspanol, data, refetch, isRefetching } =
    useDiaYHoraActual();

  return (
    <section className={style.body}>
      <div>
        <h1>Turno Actual</h1>
        <h2>
          {diaActualEnEspanol} {horaActual}:00
        </h2>
      </div>
      <div className={style.seccionForms}>
        <FormularioPrueba
          setLoading={setCargando}
          socket={socket}
          horaActual={horaActual}
          diaActualEnEspanol={diaActualEnEspanol}
        />
        <FormularioTurnoSiguiente
          setLoading={setCargando}
          socket={socket}
          horaActual={horaActual}
          diaActualEnEspanol={diaActualEnEspanol}
        />
      </div>
    </section>
  );
}

export default LayoutForm;
