import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Header() {
  const { auth, cerrarSesion } = useContext(AuthContext);

  // Estados para controlar la visibilidad de los dropdowns
  const [showPiletasDropdown, setShowPiletasDropdown] = useState(false);
  const [showUsuariosDropdown, setShowUsuariosDropdown] = useState(false);
  const [showActividadesDropdown, setShowActividadesDropdown] = useState(false);

  // Funciones para alternar la visibilidad de los dropdowns
  const togglePiletasDropdown = () => {
    setShowUsuariosDropdown(false);
    setShowActividadesDropdown(false);
    setShowPiletasDropdown(!showPiletasDropdown);
  };
  const toggleUsuariosDropdown = () => {
    setShowActividadesDropdown(false);
    setShowPiletasDropdown(false);
    setShowUsuariosDropdown(!showUsuariosDropdown);
  };
  const toggleActividadesDropdown = () => {
    setShowPiletasDropdown(false);
    setShowUsuariosDropdown(false);
    setShowActividadesDropdown(!showActividadesDropdown);
  };

  return (
    <nav className="nav justify-content-around">
      {/* Dropdown para Piletas */}
      <li className="nav-item dropdown" style={{ listStyle: "none" }}>
        <a
          className="nav-link dropdown-toggle"
          role="button"
          onClick={togglePiletasDropdown}
          aria-expanded={showPiletasDropdown}
        >
          Piletas
        </a>
        <ul className={`dropdown-menu ${showPiletasDropdown ? "show" : ""}`}>
          <li>
            <Link
              className="dropdown-item"
              to="/dashboard"
              onClick={togglePiletasDropdown}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item"
              to="dashboard/buscar-pileta"
              onClick={togglePiletasDropdown}
            >
              Buscar
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item"
              to="qr"
              onClick={togglePiletasDropdown}
            >
              QR
            </Link>
          </li>
        </ul>
      </li>

      {/* Dropdown para Actividades (solo si es SUPER_ADMIN) */}
      {auth.role === "SUPER_ADMIN" && (
        <li className="nav-item dropdown" style={{ listStyle: "none" }}>
          <a
            className="nav-link dropdown-toggle"
            role="button"
            onClick={toggleActividadesDropdown}
            aria-expanded={showActividadesDropdown}
          >
            Actividades
          </a>
          <ul
            className={`dropdown-menu ${showActividadesDropdown ? "show" : ""}`}
          >
            <li>
              <Link
                className="dropdown-item"
                to="dashboard/actividades"
                onClick={toggleActividadesDropdown}
              >
                Lista
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="dashboard/actividades/create"
                onClick={toggleActividadesDropdown}
              >
                Crear
              </Link>
            </li>
          </ul>
        </li>
      )}

      {/* Si no es SUPER_ADMIN, solo mostrar el link sin dropdown */}
      {auth.role !== "SUPER_ADMIN" && (
        <Link
          to="dashboard/actividades"
          className="nav-link"
          onClick={togglePiletasDropdown}
        >
          Actividades
        </Link>
      )}

      {/* Dropdown para Usuarios (dependiendo del rol) */}
      {auth.role === "SUPER_ADMIN" || auth.role === "ADMINISTRATIVO" ? (
        <li className="nav-item dropdown" style={{ listStyle: "none" }}>
          <a
            className="nav-link dropdown-toggle"
            role="button"
            onClick={toggleUsuariosDropdown}
            aria-expanded={showUsuariosDropdown}
          >
            Usuarios
          </a>
          <ul className={`dropdown-menu ${showUsuariosDropdown ? "show" : ""}`}>
            {auth.role === "SUPER_ADMIN" && (
              <>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/user-list/todos"
                    onClick={toggleUsuariosDropdown}
                  >
                    Habilitar
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/user-list/convencional"
                    onClick={toggleUsuariosDropdown}
                  >
                    Habilitar Convencional
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/user-list/adaptada"
                    onClick={toggleUsuariosDropdown}
                  >
                    Habilitar Adaptada
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/user-list/certificado"
                    onClick={toggleUsuariosDropdown}
                  >
                    Certificado
                  </Link>
                </li>
              </>
            )}
            {auth.role === "ADMINISTRATIVO" && (
              <>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/user-list/convencional"
                    onClick={toggleUsuariosDropdown}
                  >
                    Habilitar Convencional
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="dashboard/habilitar/certificado"
                    onClick={toggleUsuariosDropdown}
                  >
                    Certificado
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                className="dropdown-item"
                to="peticiones"
                onClick={toggleUsuariosDropdown}
              >
                Peticiones
              </Link>
            </li>
          </ul>
        </li>
      ) : null}

      {/* Botón de Cerrar sesión */}
      <li>
        <button className="mt-1 btn btn-sm btn-warning" onClick={cerrarSesion}>
          <i className="bi bi-box-arrow-left fw-bold"></i>
        </button>
      </li>
    </nav>
  );
}

export default Header;
