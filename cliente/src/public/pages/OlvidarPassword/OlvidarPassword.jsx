import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";

import Swal from "sweetalert2";
import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

function OlvidarPassword() {
  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  const [datos, setDatos] = useState(false);

  const [dni, setDni] = useState(0);

  const mutation = useMutation(UserFetch.comprobarDatos, {
    onSuccess: (data) => {
      //volver valores de los input a 0

      document.querySelector('input[name="dni"]').value = "";
      document.querySelector('input[name="telefono"]').value = "";

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

  const mutation2 = useMutation(UserFetch.modificarContraseña, {
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
          .catch(() => {
            return false;
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

    if (data.password !== data.repetir) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    const data2 = {
      dni,
      password: data.password,
    };

    mutation2.mutate(data2);
  };

  return (
    <div>
      <div className={`form-group`} style={{ padding: "20px" }}>
        <h3>Recuperar Contraseña</h3>

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

            <div className={`mt-4 `} style={{}}>
              <label
                htmlFor="password"
                style={{
                  marginBottom: "-5px",
                }}
              >
                Repetir Contraseña
              </label>
              <div className="input-group mb-3">
                <input
                  type={viewPass2 ? "text" : "password"}
                  name="repetir"
                  className="form-control"
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  {!viewPass2 ? (
                    <i
                      className="bi bi-eye ms-1"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass2(!viewPass2)}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-eye-slash ms-1"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass2(!viewPass2)}
                    ></i>
                  )}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column">
              {mutation2.isLoading ? (
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

export default OlvidarPassword;
