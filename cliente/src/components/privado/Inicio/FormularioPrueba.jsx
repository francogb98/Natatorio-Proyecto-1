import React from "react";

function FormularioPrueba({ registrarUsuario }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    registrarUsuario({
      id: e.target[0].value,
    });
  };

  return (
    <div>
      <form className="form-control" onSubmit={handleSubmit}>
        <h3>Registrar Usuario Turno Actual</h3>
        <label htmlFor="">Ingresar Id Usuario</label>
        <input type="text" />
        <button>Registrar</button>
      </form>
    </div>
  );
}

export default FormularioPrueba;
