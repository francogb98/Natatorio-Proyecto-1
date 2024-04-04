import React from "react";

function Datos({ user }) {
  return (
    <>
      <p>
        Nombre:<span>{user.nombre}</span>
      </p>
      <p>
        Apellido:<span>{user.apellido}</span>
      </p>
      <p>
        Edad:<span>{user.edad}</span>
      </p>
      <p>
        Sexo:<span>{user.sexo}</span>
      </p>
      <p>
        Natacion Adaptada:
        <span>{user.natacionAdaptada ? "Si" : "No"}</span>
      </p>
      <p>
        Telefono:<span>{user.telefono}</span>
      </p>
      <p>
        Telefono de emergenica:<span> {user.telefonoContacto}</span>
      </p>
      <p>
        Barrio :<span>{user.barrio ?? null}</span>
      </p>
      <p>
        Ciudad:<span>{user.ciudad ?? null}</span>
      </p>
      <p>
        DNI:<span>{user.dni}</span>
      </p>
      <p>
        Diagnostico:
        <span>{user.diagnositco ? user.diagnostico : "No"}</span>
      </p>
    </>
  );
}

export default Datos;
