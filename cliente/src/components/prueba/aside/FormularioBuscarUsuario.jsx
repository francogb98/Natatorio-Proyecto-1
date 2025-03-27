import { useEffect, useId, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { cambioTurno } from "../helpers/cambiarTurno.js";
import peticiones_buscador from "./peticiones_buscador.jsx";
import Card_User from "./Card_User.jsx";
import Swal from "sweetalert2";

function FormularioBuscarUsuario() {
  const [filtro, setFiltro] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

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
        queryClient.invalidateQueries([
          "getUsrsByDate",
          "piletas",
          "usuariosTurnoSiguiente",
        ]);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un error",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    },
  });

  const handleAnularTurno = () => {
    if (!mostrarConfirmacion) {
      setMostrarConfirmacion(true);
      return;
    }

    anularTurno.mutate();
    setMostrarConfirmacion(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (filtro.length > 2) {
      buscarUsuario.mutate(filtro);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFiltro(value);

    if (value.length < 3) {
      if (timeoutId) clearTimeout(timeoutId);
      return;
    }

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      buscarUsuario.mutate(value);
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="card shadow-sm border-0 p-3">
      <div className="d-flex flex-column gap-3 mb-4">
        <button
          className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2 fw-bold"
          onClick={() => cambiarTurno.mutate()}
          disabled={cambiarTurno.isLoading}
        >
          <i className="bi bi-arrow-repeat"></i>
          {cambiarTurno.isLoading ? "Procesando..." : "Iniciar Turno"}
        </button>

        {/* Nuevo sistema de confirmación */}
        {!mostrarConfirmacion ? (
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
            onClick={() => setMostrarConfirmacion(true)}
            disabled={anularTurno.isLoading}
          >
            <i className="bi bi-x-circle"></i>
            Anular Turno
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger flex-grow-1"
              onClick={handleAnularTurno}
              disabled={anularTurno.isLoading}
            >
              {anularTurno.isLoading ? "Procesando..." : "Confirmar Anulación"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setMostrarConfirmacion(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Resto del código permanece igual */}
      {(cambiarTurno.isLoading || anularTurno.isLoading) && (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">
            {anularTurno.isLoading
              ? "Anulando turno y registrando asistencias..."
              : "Iniciando nuevo turno, verificando certificados..."}
          </p>
        </div>
      )}

      {!(cambiarTurno.isLoading || anularTurno.isLoading) && (
        <>
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                value={filtro}
                onChange={handleChange}
                className="form-control"
                placeholder="Buscar por nombre, apellido o ID"
                aria-label="Buscar usuario"
              />
              <button
                type="submit"
                className="btn btn-success"
                disabled={filtro.length < 3}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            {filtro.length > 0 && filtro.length < 3 && (
              <small className="text-muted">
                Ingrese al menos 3 caracteres
              </small>
            )}
          </form>

          {buscarUsuario.isLoading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Buscando...</span>
              </div>
            </div>
          )}

          {buscarUsuario.data?.status === "error" && filtro.length > 2 && (
            <div className="alert alert-warning text-center">
              {buscarUsuario.data.message}
            </div>
          )}

          {userEncontardo && buscarUsuario.data?.status === "success" && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Resultados de búsqueda</h5>
                {buscarUsuario.data.users.length > 4 && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setUserEncontrado(false)}
                  >
                    <i className="bi bi-x-lg"></i> Cerrar
                  </button>
                )}
              </div>

              <div className="row g-3 ">
                {buscarUsuario.data.users.map((user) => (
                  <div
                    className="col-12 d-flex justify-content-center"
                    key={user._id}
                  >
                    <Card_User
                      user={user}
                      setUserEncontrado={setUserEncontrado}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FormularioBuscarUsuario;
