import React, { useState, useEffect } from "react";
import { User, Activity } from "../../../../../../components/prueba/models";
import { Link } from "react-router-dom";

function Tabla({ actividad }: { actividad: Activity }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;

  // Filtrar usuarios por customId
  const filteredUsers = actividad.users.filter((user) =>
    user.customId.toString().includes(searchTerm)
  );

  // Calcular usuarios a mostrar
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Resetear a página 1 cuando se busca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-2">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID de usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-hover mb-3">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Edad</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user: User) => (
                <UserRow key={user._id} user={user} />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  {searchTerm
                    ? "No se encontraron usuarios con ese ID"
                    : "No hay usuarios inscritos en esta actividad"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {filteredUsers.length > usersPerPage && (
        <nav
          aria-label="Page navigation example"
          className="d-flex justify-content-center mb-2"
        >
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {/* Mostrar números de página (máximo 5) */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <li
                  key={pageNum}
                  className={`page-item ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

// Componente para mostrar cada fila de usuario
function UserRow({ user }: { user: User }) {
  return (
    <tr>
      <td>
        <Link to={`/usuario/${user._id}`} className="text-decoration-none">
          <strong>{user.customId}</strong>
        </Link>
      </td>
      <td>{user.nombre}</td>
      <td>{user.apellido}</td>
      <td>{user.edad}</td>
      <td>{user.dni}</td>
      <td>{user.telefono}</td>
      <td>
        <span className={`badge ${!user.status ? "bg-warning" : "bg-success"}`}>
          {!user.status ? "Pendiente" : "Habilitado"}
        </span>
      </td>
    </tr>
  );
}

export default Tabla;
