import React from "react";

function FormularioPrueba({
  setLoading,
  socket,
  horaActual,
  diaActualEnEspanol,
}) {
  const registrarUsuario = (e) => {
    e.preventDefault();
    setLoading(true);
    socket?.emit("agregar-usuario", {
      id: e.target[0].value,
      horaActual: horaActual + ":00",
      HoraFinalTurno: parseInt(horaActual) + 1 + ":00",
      dia: diaActualEnEspanol,
    });
  };

  return (
    <form onSubmit={(e) => registrarUsuario(e)}>
      <h5>Registrar Turno Actual</h5>

      <input type="text" />
      <button>Registrar</button>
    </form>
  );
}

export default FormularioPrueba;
