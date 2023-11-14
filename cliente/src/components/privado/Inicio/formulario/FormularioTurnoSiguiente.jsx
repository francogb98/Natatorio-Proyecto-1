import React from "react";

function FormularioTurnoSiguiente({
  setLoading,
  socket,
  horaActual,
  diaActualEnEspanol,
}) {
  const registrarUsuarioTurnoSiguiente = (e) => {
    e.preventDefault();
    setLoading(true);
    socket?.emit("agregar-usuario-turno-siguiente", {
      id: e.target[0].value,
      horaSiguienteTurno: parseInt(horaActual) + 1 + ":00",
      dia: diaActualEnEspanol,
    });
  };

  return (
    <div>
      <form onSubmit={(e) => registrarUsuarioTurnoSiguiente(e)}>
        <h5>Registrar Turno Siguiente</h5>
        <input type="text" />
        <button>Registrar</button>
      </form>
    </div>
  );
}

export default FormularioTurnoSiguiente;
