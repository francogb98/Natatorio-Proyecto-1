import React from "react";

function LoadingTable({ find }) {
  return (
    <div className="container mt-2">
      <div className="row text-center">
        <h2>Seccion Habilitar Usuarios</h2>
      </div>

      <dir className="row table-responsive">
        <table className="table table-striped table-hover table-sm table-bordered">
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "5px" }}>Id</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Nombre
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Actividad
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Archivos
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Habilitar
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {find ? (
                <td colSpan="5" className="text-center">
                  {" "}
                  {/* Usar colSpan para ocupar todas las columnas */}
                  <div
                    className="spinner-border text-primary mt-1 me-5"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              ) : (
                <td colSpan="5" className="text-center">
                  No se encontraron usuarios
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </dir>
    </div>
  );
}

export default LoadingTable;
