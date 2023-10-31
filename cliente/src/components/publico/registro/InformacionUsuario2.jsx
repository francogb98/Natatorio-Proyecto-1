import React from "react";

function InformacionUsuario2({ setEsMenor, setUsuario, usuario }) {
  return (
    <div>
      {" "}
      <div className="mb-2">
        <label htmlFor="Dni">Dni</label>
        <input
          type="text"
          name="dni"
          value={usuario.dni}
          className="form-control"
          onChange={(e) => {
            setUsuario({ ...usuario, dni: e.target.value });
          }}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="Edad">Edad</label>
        <input
          type="text"
          name="edad"
          className="form-control"
          value={usuario.edad}
          onChange={(e) => {
            setUsuario({ ...usuario, edad: e.target.value });
            if (e.target.value < 18) {
              setEsMenor(true);
            } else {
              setEsMenor(false);
            }
          }}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="dni" className={`form-label  mt-2`}>
          Sexo
        </label>
        <select
          className="form-select"
          name="sexo"
          id="sexo"
          onChange={(e) => {
            setUsuario({ ...usuario, sexo: e.target.value });
          }}
          defaultValue={usuario.sexo}
        >
          <option value="null">--Sexo--</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    </div>
  );
}

export default InformacionUsuario2;
