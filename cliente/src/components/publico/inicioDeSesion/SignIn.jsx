import React, { useContext, useEffect } from "react";
import { fetchSinToken } from "../../../helpers/fetch";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";

import { useNavigate, redirect } from "react-router-dom";
import Swal from "sweetalert2";

import style from "./styleSignIn.module.css";
import { AuthContext } from "../../../context/AuthContext";

import Logo from "./Logo.jpg";

function SignIn() {
  const { dispatch } = useContext(AuthContext);

  const [viewPass, setViewPass] = React.useState(false);

  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: async (data) => {
      if (data.status === "success") {
        if (data.usuario.role === "suspendido") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tu cuenta esta suspendida, contacta con el administrador",
          });
          return;
        }

        localStorage.setItem("token", data.token);
        const { usuario } = data;

        await dispatch({ type: "LOGIN", payload: { role: usuario.role } });
        await dispatch({ type: "SET_USER", payload: { user: usuario } });

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Iniciaste sesion correctamente, seras redirigido al home",
          showConfirmButton: false,
        });

        setTimeout(() => {
          Swal.close();
          if (
            data.usuario.role === "usuario" ||
            data.usuario.role === "registrado"
          ) {
            return navigate("/user/home");
          }
          return navigate("/admin/panel/inicio");
          // window.location.href = "/home";
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    },
  });

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

  useEffect(() => {
    if (login.isSuccess) {
    }
  }, [login.isSuccess]);
  return (
    <div className={style.container}>
      <div className={`form-group ${style.formBody}`}>
        <img src={Logo} alt="" style={{ width: "160px" }} />
        <h1>Inicio De Sesion</h1>
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

          <button
            type="submit"
            value="Iniciar Sesion"
            className={style.buttonInicioSesion}
          >
            {" "}
            Iniciar Sesion
          </button>
        </form>
        {login.isLoading ? (
          <div className="spinner-border text-primary mt-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
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
