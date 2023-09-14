import React from "react";
import { barriosLaBanda, barrios, ciudades } from "./dataBarrios";

function Barrio() {
  const [ciudad, setCiudad] = React.useState("");
  const [barrio, setBarrio] = React.useState("");

  return (
    <>
      <label htmlFor="barrio" className={`form-label  mt-2 `}>
        Ciudad
      </label>
      <select
        className={`form-select `}
        value={ciudad}
        name="ciudad"
        id="ciudad"
        onChange={(e) => setCiudad(e.target.value)}
      >
        <option value="null">--Ciudad--</option>
        {ciudades &&
          ciudades.map((ciudad, i) => (
            <option key={i} value={ciudad}>
              {ciudad}
            </option>
          ))}
      </select>
      {ciudad === "Santiago del Estero" || ciudad === "La Banda" ? (
        <div key="barrio">
          <label htmlFor="barrio" className={`form-label  mt-2`}>
            Barrio
          </label>
          <select
            className="form-select"
            value={barrio}
            name="barrio"
            id="barrio"
            onChange={(e) => setBarrio(e.target.value)}
          >
            <option value="null">--Barrio--</option>
            {ciudad === "Santiago del Estero"
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
