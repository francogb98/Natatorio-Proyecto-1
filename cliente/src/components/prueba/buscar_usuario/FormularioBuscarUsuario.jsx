import { useState } from "react";
import peticiones_buscador from "./peticiones_buscador.jsx";
import Card_User from "./Card_User.jsx";

function FormularioBuscarUsuario() {
  const [filtro, setFiltro] = useState("");

  const { userEncontardo, setUserEncontrado, buscarUsuario } =
    peticiones_buscador();

  const handleSearch = (e) => {
    e.preventDefault();
    buscarUsuario.mutate(filtro);
  };
  return (
    <section className="container">
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
                  <Card_User key={user._id} user={user}></Card_User>
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