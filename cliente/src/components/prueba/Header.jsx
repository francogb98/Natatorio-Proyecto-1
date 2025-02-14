import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { auth, cerrarSesion } = useContext(AuthContext);

  return (
    <nav className="nav justify-content-around">
      <li
        className="nav-item dropdown"
        style={{
          listStyle: "none",
        }}
      >
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Piletas
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/home">
              Lista
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/home/buscar">
              Buscar
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/qr">
              QR
            </Link>
          </li>
        </ul>
      </li>
      {auth.role == "SUPER_ADMIN" && (
        <li
          className="nav-item dropdown"
          style={{
            listStyle: "none",
          }}
        >
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Actividades
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="actividades">
                Lista
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="actividades/create">
                Crear
              </Link>
            </li>
          </ul>
        </li>
      )}
      {auth.role !== "SUPER_ADMIN" && (
        <Link to="actividades" className="nav-link">
          Actividades
        </Link>
      )}

      {auth.role == "SUPER_ADMIN" && (
        <li
          className="nav-item dropdown"
          style={{
            listStyle: "none",
          }}
        >
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Usuarios
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/dashboard/user-list/todos">
                Habilitar
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="dashboard/user-list/convencional"
              >
                Habilitar Convencional
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="dashboard/user-list/adaptada">
                Habilitar Adaptada
              </Link>
            </li>

            <li>
              <Link
                className="dropdown-item"
                to="dashboard/user-list/certificado"
              >
                Certificado
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="peticiones">
                Peticiones
              </Link>
            </li>
          </ul>
        </li>
      )}

      {auth.role == "ADMINISTRATIVO" && (
        <li
          className="nav-item dropdown"
          style={{
            listStyle: "none",
          }}
        >
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Usuarios
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="habilitar/convencional">
                Habilitar Convencional
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="habilitar/certificado">
                Certificado
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="peticiones">
                Peticiones
              </Link>
            </li>
          </ul>
        </li>
      )}

      <li>
        <button className="mt-1 btn btn-sm btn-warning" onClick={cerrarSesion}>
          <i className="bi bi-box-arrow-left fw-bold"></i>
        </button>
      </li>
    </nav>
  );
}

export default Header;
