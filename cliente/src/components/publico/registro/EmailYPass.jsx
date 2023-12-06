import React, { useState } from "react";
import style from "./styleFormulario.module.css";

function EmailYPass({ registro, usuario, setUsuario }) {
  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  return (
    <div>
      <div className="mb-2">
        <label htmlFor="Password">Password</label>
        <div className="input-group mb-3">
          <input
            type={viewPass ? "text" : "password"}
            name="password"
            className="form-control"
            onChange={(e) => {
              setUsuario({ ...usuario, password: e.target.value });
            }}
            value={usuario.password}
            aria-describedby="basic-addon1"
          />
          <span className="input-group-text" id="basic-addon1">
            {!viewPass ? (
              <i
                className="bi bi-eye"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass(!viewPass)}
              ></i>
            ) : (
              <i
                className="bi bi-eye-slash"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass(!viewPass)}
              ></i>
            )}
          </span>
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="Repetir Password">Repetir Password</label>
        <div className="input-group mb-3">
          <input
            type={viewPass2 ? "text" : "password"}
            name="repetir password"
            className="form-control"
            onChange={(e) => {
              setUsuario({ ...usuario, repetirPassword: e.target.value });
            }}
            value={usuario.repetirPassword}
            aria-describedby="basic-addon1"
          />
          <span className="input-group-text" id="basic-addon1">
            {!viewPass2 ? (
              <i
                className="bi bi-eye"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass2(!viewPass2)}
              ></i>
            ) : (
              <i
                className="bi bi-eye-slash"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass2(!viewPass2)}
              ></i>
            )}
          </span>
        </div>
      </div>

      {registro.isLoading && !registro.isSuccess && (
        <div className="alert alert-info">Cargando datos...</div>
      )}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <button className="btn btn-dark">Registrate</button>
      </div>
    </div>
  );
}

export default EmailYPass;
