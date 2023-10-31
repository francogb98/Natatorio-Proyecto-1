import React, { useState } from "react";
import style from "./styleFormulario.module.css";

function EmailYPass({ registro, usuario, setUsuario }) {
  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  return (
    <div>
      <div className="mb-2">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter Email"
          onChange={(e) => {
            setUsuario({ ...usuario, email: e.target.value });
          }}
          value={usuario.email}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="Password">Password</label>
        <div className="d-flex">
          <input
            type={viewPass ? "text" : "password"}
            name="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => {
              setUsuario({ ...usuario, password: e.target.value });
            }}
            value={usuario.password}
          />
          {!viewPass ? (
            <i
              className="bi bi-eye"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setViewPass(!viewPass)}
            ></i>
          ) : (
            <i
              class="bi bi-eye-slash"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setViewPass(!viewPass)}
            ></i>
          )}
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="Repetir Password">Repetir Password</label>
        <div className="d-flex">
          <input
            type={viewPass2 ? "text" : "password"}
            name="repetir password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => {
              setUsuario({ ...usuario, repetirPassword: e.target.value });
            }}
            value={usuario.repetirPassword}
          />

          {!viewPass2 ? (
            <i
              className="bi bi-eye"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setViewPass2(!viewPass2)}
            ></i>
          ) : (
            <i
              class="bi bi-eye-slash"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setViewPass2(!viewPass2)}
            ></i>
          )}
        </div>
      </div>

      {registro.isLoading && !registro.isSuccess && (
        <div className="alert alert-info">Cargando datos...</div>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn btn-dark">Registrate</button>
      </div>
    </div>
  );
}

export default EmailYPass;
