import React from "react";
import { barriosLaBanda, barrios, ciudades } from "./dataBarrios";

function Barrio({ setUsuario, usuario }) {
  const [ciudad, setCiudad] = React.useState("");
  const [barrio, setBarrio] = React.useState("");

  return (
    <>
      <label htmlFor="barrio" className={`form-label  mt-2 `}>
        Ciudad
      </label>
      <select
        className={`form-select `}
        name="ciudad"
        id="ciudad"
        onChange={(e) => {
          setCiudad(e.target.value);
          setUsuario({ ...usuario, ciudad: e.target.value });
        }}
        defaultValue={usuario.ciudad}
      >
        <option value="null">--Ciudad--</option>
        {ciudades &&
          ciudades.map((ciudad, i) => (
            <option key={i} value={ciudad}>
              {ciudad}
            </option>
          ))}
      </select>
      {usuario.ciudad === "Santiago del Estero" ||
      usuario.ciudad === "La Banda" ? (
        <div key="barrio">
          <label htmlFor="barrio" className={`form-label  mt-2`}>
            Barrio
          </label>
          <select
            className="form-select"
            name="barrio"
            id="barrio"
            onChange={(e) => {
              setBarrio(e.target.value);
              setUsuario({ ...usuario, barrio: e.target.value });
            }}
            defaultValue={usuario.barrio}
          >
            <option value="">--Barrio--</option>
            {usuario.ciudad === "Santiago del Estero"
              ? barrios.map((barrio, i) => (
                  <option key={i} value={barrio}>
                    {barrio}
                  </option>
                ))
              : barriosLaBanda.map((barrio, i) => (
                  <option key={i} value={barrio}>
                    {barrio}
                  </option>
                ))}
          </select>
        </div>
      ) : null}
    </>
  );
}

export default Barrio;
