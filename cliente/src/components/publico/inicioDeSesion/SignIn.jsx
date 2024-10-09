import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

import style from "./styleSignIn.module.css";
import { AuthContext } from "../../../context/AuthContext";

import Logo from "./Logo.jpg";

function SignIn() {
  const { login } = useContext(AuthContext);

  const [viewPass, setViewPass] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (data.dni.length === 0 || data.password.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios",
      });
      return;
    }
    login.mutate({
      endpoint: "login",
      data,
      method: "POST",
    });
  };

  return (
    <div className={style.container}>
      <div className={`form-group ${style.formBody}`}>
        <img
          src={Logo}
          alt=""
          style={{
            maxWidth: "280px",
            marginBlock: "10px",
            paddingInline: "10px",
          }}
        />
        <h2>Inicio De Sesion</h2>
        <form action="" className={`form-group `} onSubmit={handleSubmit}>
          <div className={`mb-2 `}>
            <label htmlFor="Dni">Dni</label>
            <input type="number" name="dni" className="form-control" />
          </div>

          <div className={`mb-2 `} style={{}}>
            <label htmlFor="password">Contraseña</label>

            <div className="input-group mb-3">
              <input
                type={viewPass ? "text" : "password"}
                name="password"
                className="form-control"
                aria-describedby="basic-addon1"
              />
              <span className="input-group-text" id="basic-addon1">
                {!viewPass ? (
                  <i
                    className="bi bi-eye ms-1"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={() => setViewPass(!viewPass)}
                  ></i>
                ) : (
                  <i
                    className="bi bi-eye-slash ms-1"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={() => setViewPass(!viewPass)}
                  ></i>
                )}
              </span>
            </div>
          </div>

          {login.isLoading ? (
            <div className="spinner-border text-primary mt-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}

          <button
            type="submit"
            value="Iniciar Sesion"
            className={style.buttonInicioSesion}
          >
            {" "}
            Iniciar Sesion
          </button>
        </form>

        <div>
          <Link to="/recuperar-contraseña">¿Has olvidado la contraseña?</Link>
        </div>

        <div className="mt-3">
          <p className="fw-bold">
            ¿No tienes cuenta?{" "}
            <Link to="/login">
              <button className="btn btn-lg btn-warning">Registrate</button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
