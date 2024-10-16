import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { cambioTurno } from "../helpers/cambiarTurno.js";

import peticiones_buscador from "./peticiones_buscador.jsx";

import Card_User from "./Card_User.jsx";
import Swal from "sweetalert2";

function FormularioBuscarUsuario() {
  const [filtro, setFiltro] = useState("");

  const { userEncontardo, setUserEncontrado, buscarUsuario } =
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

  return (
    <section className="container">
      <div className="col-12 d-flex flex-column align-items-center mb-3">
        <button
          className="btn btn-lg btn-danger"
          onClick={() => {
            cambiarTurno.mutate();
          }}
        >
          Iniciar Turno
        </button>
      </div>

      {cambiarTurno.isLoading ? (
        <div
          className="d-flex flex-column"
          style={{
            alignItems: "center",
          }}
        >
          <h5 className="text-center">Iniciando un nuevo turno...</h5>
          <small>verificando certificado de usuarios</small>
          <small>verificando asistencia de usuarios</small>
          <div className="spinner-border text-primary mt-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
              onChange={(e) => setFiltro(e.target.value)}
              className="form-control"
              placeholder="buscar usuario"
            />
            <button type="submit" className="btn btn-success  ms-3">
              Buscar
            </button>
          </form>
          {buscarUsuario.isLoading ? (
            <div className="spinner-border text-primary ms-1" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}
          {buscarUsuario.data?.status === "error" ? (
            <h3>{buscarUsuario.data.message}</h3>
          ) : null}
          {userEncontardo && (
            <div className="row mt-3 d-flex flex-column align-items-center">
              <button
                className="btn btn-danger"
                style={{ width: "fit-content" }}
                onClick={() => {
                  setUserEncontrado(false);
                }}
              >
                cerrar
              </button>
              {buscarUsuario.data?.status == "success"
                ? buscarUsuario.data?.users.map((user, i) => (
                    <div
                      className={`col-12 d-flex justify-content-center g-1`}
                      key={i}
                    >
                      <Card_User key={i} user={user}></Card_User>
                    </div>
                  ))
                : null}
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
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default FormularioBuscarUsuario;
