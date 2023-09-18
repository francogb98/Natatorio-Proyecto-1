import React from "react";

function FormSearch({ getUserById }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    getUserById.mutate({ id });
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Buscar Usuario</h1>
      <form
        action=""
        className={`form-group `}
        style={{
          padding: "40px",
          border: "1px solid black",
          borderRadius: "10px",
        }}
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <h2>Insertar Id</h2>
          <input type="text" name="id" className="form-control" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {getUserById.isLoading ? (
            <div className="spinner-border text-warning mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}
          {getUserById.data && getUserById.data.status == "error" ? (
            <h3>{getUserById.data.message}</h3>
          ) : null}

          <button
            type="submit"
            value="Iniciar Sesion"
            className="mt-2 btn btn-lg btn-warning"
            // data-bs-toggle="modal"
            // data-bs-target="#staticBackdrop"
          >
            {" "}
            Buscar Usario
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormSearch;
