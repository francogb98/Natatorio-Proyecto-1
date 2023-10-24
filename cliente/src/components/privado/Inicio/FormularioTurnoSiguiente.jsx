import React from "react";

function FormularioTurnoSiguiente({ registrarUsuarioTurnoSiguiente }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    registrarUsuarioTurnoSiguiente({
      id: e.target[0].value,
    });
  };

  return (
    <div>
      <form className="form-control" onSubmit={handleSubmit}>
        <h3>Registrar Usuario Turno Siguiente</h3>
        <label htmlFor="">Ingresar Id Usuario</label>
        <input type="text" />
        <button>Registrar</button>
      </form>
    </div>
  );
}

export default FormularioTurnoSiguiente;
