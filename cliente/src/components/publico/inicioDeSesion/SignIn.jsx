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

  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: (data) => {
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

        dispatch({ type: "LOGIN", payload: { role: usuario.role } });
        dispatch({ type: "SET_USER", payload: { user: usuario } });

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Iniciaste sesion correctamente, seras redirigido al home",
          showConfirmButton: false,
        });

        setTimeout(() => {
          Swal.close();
          if (usuario.role === "ADMIN" || usuario.role === "SUPER_ADMIN") {
            return navigate("/");
          } else {
            if (usuario.activity.length === 0) {
              return navigate("/home/actividades");
            } else {
              return navigate("/");
            }
          }

          // window.location.href = "/home";
        }, 1000);
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
          <div className="mb-2">
            <label htmlFor="Dni">Dni</label>
            <input
              type="text"
              name="dni"
              className="form-control"
              placeholder="Enter Dni"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password"
            />
          </div>

          <button type="submit" value="Iniciar Sesion" className="mt-2">
            {" "}
            Iniciar Sesion
          </button>
        </form>
        {login.isLoading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
        <div className="mt-3">
          <p>
            ¿No tienes cuenta? <Link to="/login">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
