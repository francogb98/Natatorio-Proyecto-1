import React from "react";
import { Link } from "react-router-dom";

import style from "../inicioDeSesion/styleSignIn.module.css";

import Logo from "../inicioDeSesion/Logo.jpg";

import {
  comprobarDatos,
  modificarContraseña,
} from "../../../helpers/usersFetch/recuperarContraseña";

import { useMutation } from "react-query";

import Swal from "sweetalert2";

function RecuperarContraseña() {
  const [viewPass, setViewPass] = React.useState(false);

  const [datos, setDatos] = React.useState(false);

  const [dni, setDni] = React.useState(0);
  const [password, setPassword] = React.useState("");

  const mutation = useMutation(comprobarDatos, {
    onSuccess: (data) => {
      //volver valores de los input a 0

      document.querySelector('input[name="dni"]').value = "";
      document.querySelector('input[name="telefono"]').value = "";

      console.log(data);
      if (data.status === "success") {
        setDni(data.user.dni);
        setDatos(true);
      }

      if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    },
  });

  const mutation2 = useMutation(modificarContraseña, {
    onSuccess: (data) => {
      //volver valores de los input a 0
      document.querySelector('input[name="password"]').value = "";
      document.querySelector('input[name="repetir"]').value = "";

      if (data.status === "success") {
        setDatos(false);
        Swal.fire({
          icon: "success",
          title: "Contraseña modificada",
          text: "Redireccionando al inicio de sesion",
          showConfirmButton: false,
          timer: 1500,
        })
          .then(() => {
            window.location.href = "/";
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    mutation.mutate(data);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log(data);

    if (data.password !== data.repetir) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    setPassword(data.password);

    const data2 = {
      dni,
      password: data.password,
    };

    mutation2.mutate(data2);
  };

  return (
    <div className={style.container}>
      <div className={`form-group ${style.formBody}`}>
        <img src={Logo} alt="" style={{ width: "160px" }} />
        <h1>Recuperar Contraseña</h1>

        {!datos ? (
          <form
            action=""
            className={`form-group `}
            style={{
              paddingInline: "20px",
            }}
            onSubmit={handleSubmit}
          >
            <div className={`mb-2 `}>
              <label
                htmlFor="Dni"
                style={{
                  marginBottom: "-5px",
                }}
              >
                Dni
              </label>
              <input type="number" name="dni" className="form-control" />
            </div>

            <div className={`mt-4 `} style={{}}>
              <label
                htmlFor="password"
                style={{
                  marginBottom: "-5px",
                }}
              >
                Ultimos 4 numeros telefono de emergencia
              </label>
              <input type="number" name="telefono" className="form-control" />
            </div>

            <div className="d-flex flex-column">
              {mutation.isLoading ? (
                <div
                  className="spinner-border text-primary mt-2 d-block mx-auto"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : null}

              <button className="btn btn-success mt-2">Continuar</button>
            </div>
          </form>
        ) : (
          <form
            action=""
            className={`form-group `}
            style={{
              paddingInline: "20px",
            }}
            onSubmit={handleSubmit2}
          >
            <div className={`mb-2 `}>
              <label
                htmlFor="Dni"
                style={{
                  marginBottom: "-5px",
                }}
              >
                Contraseña
              </label>
              <input type="number" name="password" className="form-control" />
            </div>

            <div className={`mt-4 `} style={{}}>
              <label
                htmlFor="password"
                style={{
                  marginBottom: "-5px",
                }}
              >
                Repetir Contraseña
              </label>
              <input type="number" name="repetir" className="form-control" />
            </div>

            <div className="d-flex flex-column">
              {mutation.isLoading ? (
                <div
                  className="spinner-border text-primary mt-2 d-block mx-auto"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : null}

              <button className="btn btn-warning mt-2">Modificar</button>
            </div>
          </form>
        )}

        <div className="mt-5">
          <p className="fw-bold">
            <Link to="/">
              <button className="btn btn-primary">Volver al Inicio</button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContraseña;
