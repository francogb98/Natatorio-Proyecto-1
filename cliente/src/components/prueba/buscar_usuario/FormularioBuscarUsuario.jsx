import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { cambioTurno } from "../helpers/cambiarTurno.js";

import peticiones_buscador from "./peticiones_buscador.jsx";

import Card_User from "./Card_User.jsx";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
        <Link to="/admin/panel/inicio">
          <button className="btn btn-warning mb-3">Panel anterior</button>
        </Link>

        <button
          className="btn btn-lg btn-danger"
          onClick={() => {
            cambiarTurno.mutate();
          }}
        >
          Iniciar Turno
        </button>
      </div>
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
          {buscarUsuario.data?.status === "success"
            ? buscarUsuario.data.users.map((user) => (
                <div className={`col-12 d-flex justify-content-center g-1`}>
                  <Card_User
                    key={user._id}
                    user={user}
                    inasistencia={buscarUsuario.data.inasistencias}
                  ></Card_User>
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
    </section>
  );
}

export default FormularioBuscarUsuario;
