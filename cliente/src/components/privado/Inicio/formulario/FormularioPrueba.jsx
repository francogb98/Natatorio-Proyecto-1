import React from "react";

function FormularioPrueba({ setLoading, socket }) {
  const registrarUsuario = (e) => {
    e.preventDefault();
    setLoading(true);
    socket?.emit("autorizar", {
      id: e.target[0].value,
    });

    e.target[0].value = "";
  };

  return (
    <form onSubmit={(e) => registrarUsuario(e)}>
      <h5>Autorizar</h5>

      <input type="text" />
      <button>Registrar</button>
    </form>
  );
}

export default FormularioPrueba;
