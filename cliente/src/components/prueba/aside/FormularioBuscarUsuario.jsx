import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { cambioTurno } from "../helpers/cambiarTurno.js";

import peticiones_buscador from "./peticiones_buscador.jsx";

import Card_User from "./Card_User.jsx";
import Swal from "sweetalert2";

function FormularioBuscarUsuario() {
  const [filtro, setFiltro] = useState("");

  const [timeoutId, setTimeoutId] = useState(null);

  const { userEncontardo, setUserEncontrado, buscarUsuario, anularTurno } =
    peticiones_buscador();

  const queryClient = useQueryClient();

  const cambiarTurno = useMutation(cambioTurno, {
    onSuccess: (data) => {
      if (data.status === "ok") {
        Swal.fire({
          title: "Turno cambiado",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        queryClient.invalidateQueries("getUsrsByDate");
        queryClient.invalidateQueries("piletas");
        queryClient.invalidateQueries("usuariosTurnoSiguiente");
      } else if (data.status === "error") {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    onError: (data) => {
      Swal.fire({
        title: "Error",
        text: data.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    buscarUsuario.mutate(filtro);
  };

  const handleChange = (e) => {
    setFiltro(e.target.value);

    if (e.target.value.length < 3) {
      return;
    }

    // Limpiar el timeout anterior si el usuario sigue escribiendo
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Configurar un nuevo timeout
    const newTimeoutId = setTimeout(() => {
      if (e.target.value.length > 2) {
        buscarUsuario.mutate(e.target.value);
      }
    }, 300);

    setTimeoutId(newTimeoutId);
  };
  return (
    <>
      <section className="container">
        <div className="col-12 d-flex gap-2 flex-column justify-content-center align-items-center mb-3">
          <button
            className="btn btn-lg btn-danger"
            onClick={() => {
              cambiarTurno.mutate();
            }}
          >
            Iniciar Turno
          </button>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Anular Turno
            </button>
          </div>
        </div>

        {cambiarTurno.isLoading || anularTurno.isLoading ? (
          <div
            className="d-flex flex-column"
            style={{
              alignItems: "center",
            }}
          >
            {anularTurno.isLoading ? (
              <>
                <h5 className="text-center">Anulando turno...</h5>
                <small>colocando asistencia de usuarios</small>
                <div className="spinner-border text-primary mt-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </>
            ) : (
              <>
                <h5 className="text-center">Iniciando un nuevo turno...</h5>
                <small>verificando certificado de usuarios</small>
                <small>verificando asistencia de usuarios</small>
                <div className="spinner-border text-primary mt-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <form
              action=""
              onSubmit={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #000",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
                width: "100%",
              }}
            >
              <input
                type="text"
                value={filtro}
                onChange={handleChange}
                className="form-control"
                placeholder="buscar usuario"
              />
              <button type="submit" className="btn btn-success  ms-3">
                Buscar
              </button>
            </form>
            {buscarUsuario.isLoading ? (
              <div className="d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null}
            {buscarUsuario.data?.status === "error" && filtro.length > 2 ? (
              <h4
                className="mx-auto bg-warning mt-2 p-2 rounded"
                style={{
                  width: "fit-content",
                }}
              >
                {buscarUsuario.data.message}
              </h4>
            ) : null}
            {userEncontardo && filtro.length > 2 && (
              <div className="row mt-3 d-flex flex-column align-items-center">
                {buscarUsuario.data?.status === "success"
                  ? buscarUsuario.data.users.length > 4 && (
                      <button
                        className="btn btn-danger mt-2"
                        style={{ width: "fit-content" }}
                        onClick={() => {
                          setUserEncontrado(false);
                        }}
                      >
                        cerrar
                      </button>
                    )
                  : null}
                {buscarUsuario.data?.status == "success"
                  ? buscarUsuario.data?.users.map((user, i) => (
                      <div
                        className={`col-12 d-flex justify-content-center g-1`}
                        key={i}
                      >
                        <Card_User
                          key={i}
                          user={user}
                          setUserEncontrado={setUserEncontrado}
                        ></Card_User>
                      </div>
                    ))
                  : null}
              </div>
            )}
          </>
        )}
      </section>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Anular Turno
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              En caso de anular el turno, se colocara asistencia a todos los
              usuarios del respectivo horario .
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => anularTurno.mutate()}
              >
                Anular
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormularioBuscarUsuario;
