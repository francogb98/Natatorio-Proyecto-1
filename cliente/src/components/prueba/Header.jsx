import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Header() {
  const { auth, cerrarSesion } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estado para dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  // Verificar si la ruta está activa
  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* Logo/Brand */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/dashboard"
          onClick={closeAllDropdowns}
        >
          <i className="bi bi-water me-2"></i>
          <span className="d-none d-sm-inline">Sistema Piletas</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Main Menu */}
        <div
          className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Piletas Dropdown */}
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle d-flex align-items-center ${
                  isActive("dashboard") || isActive("qr") ? "active" : ""
                }`}
                onClick={() => toggleDropdown("piletas")}
                aria-expanded={activeDropdown === "piletas"}
              >
                <i className="bi bi-droplet me-1 d-lg-none"></i>
                Piletas
              </button>
              <ul
                className={`dropdown-menu ${
                  activeDropdown === "piletas" ? "show" : ""
                }`}
              >
                <li>
                  <Link
                    className={`dropdown-item ${
                      isActive("dashboard") && !isActive("buscar-pileta")
                        ? "active"
                        : ""
                    }`}
                    to="/dashboard"
                    onClick={closeAllDropdowns}
                  >
                    <i className="bi bi-house-door me-2"></i>Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${
                      isActive("buscar-pileta") ? "active" : ""
                    }`}
                    to="dashboard/buscar-pileta"
                    onClick={closeAllDropdowns}
                  >
                    <i className="bi bi-search me-2"></i>Buscar
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${
                      isActive("qr") ? "active" : ""
                    }`}
                    to="qr"
                    onClick={closeAllDropdowns}
                  >
                    <i className="bi bi-qr-code me-2"></i>QR
                  </Link>
                </li>
              </ul>
            </li>

            {/* Actividades - Conditional Rendering */}
            {auth.role === "SUPER_ADMIN" ? (
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle d-flex align-items-center ${
                    isActive("actividades") ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown("actividades")}
                  aria-expanded={activeDropdown === "actividades"}
                >
                  <i className="bi bi-calendar3 me-1 d-lg-none"></i>
                  Actividades
                </button>
                <ul
                  className={`dropdown-menu ${
                    activeDropdown === "actividades" ? "show" : ""
                  }`}
                >
                  <li>
                    <Link
                      className={`dropdown-item ${
                        isActive("actividades") && !isActive("create")
                          ? "active"
                          : ""
                      }`}
                      to="dashboard/actividades"
                      onClick={closeAllDropdowns}
                    >
                      <i className="bi bi-list-ul me-2"></i>Lista
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`dropdown-item ${
                        isActive("create") ? "active" : ""
                      }`}
                      to="dashboard/actividades/create"
                      onClick={closeAllDropdowns}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Crear
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    isActive("actividades") ? "active" : ""
                  }`}
                  to="dashboard/actividades"
                  onClick={closeAllDropdowns}
                >
                  <i className="bi bi-calendar3 me-1 d-lg-none"></i>
                  <span className="d-inline d-lg-inline">Actividades</span>
                </Link>
              </li>
            )}

            {/* Usuarios - Conditional Rendering */}
            {(auth.role === "SUPER_ADMIN" ||
              auth.role === "ADMINISTRATIVO") && (
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle d-flex align-items-center ${
                    isActive("user-list") ||
                    isActive("habilitar") ||
                    isActive("peticiones")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => toggleDropdown("usuarios")}
                  aria-expanded={activeDropdown === "usuarios"}
                >
                  <i className="bi bi-people me-1 d-lg-none"></i>
                  Usuarios
                </button>
                <ul
                  className={`dropdown-menu ${
                    activeDropdown === "usuarios" ? "show" : ""
                  }`}
                >
                  {auth.role === "SUPER_ADMIN" && (
                    <>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/todos") ? "active" : ""
                          }`}
                          to="dashboard/user-list/todos"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-check-circle me-2"></i>Habilitar
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/convencional") ? "active" : ""
                          }`}
                          to="dashboard/user-list/convencional"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-person me-2"></i>Convencional
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/adaptada") ? "active" : ""
                          }`}
                          to="dashboard/user-list/adaptada"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-person-wheelchair me-2"></i>
                          Adaptada
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/certificado") ? "active" : ""
                          }`}
                          to="dashboard/user-list/certificado"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-file-earmark-medical me-2"></i>
                          Certificado
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/revision") ? "active" : ""
                          }`}
                          to="dashboard/user-list/revision"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-eye me-2"></i>Revisión
                        </Link>
                      </li>
                    </>
                  )}
                  {auth.role === "ADMINISTRATIVO" && (
                    <>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/certificado") ? "active" : ""
                          }`}
                          to="dashboard/user-list/certificado"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-file-earmark-medical me-2"></i>
                          Certificado
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${
                            isActive("user-list/revision") ? "active" : ""
                          }`}
                          to="dashboard/user-list/revision"
                          onClick={closeAllDropdowns}
                        >
                          <i className="bi bi-eye me-2"></i>Revisión
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      className={`dropdown-item ${
                        isActive("peticiones") ? "active" : ""
                      }`}
                      to="peticiones"
                      onClick={closeAllDropdowns}
                    >
                      <i className="bi bi-envelope me-2"></i>Peticiones
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Logout Button */}
          <div className="d-flex">
            <button
              className="btn btn-outline-light d-flex align-items-center"
              onClick={cerrarSesion}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-left me-1"></i>
              <span className="d-none d-lg-inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
