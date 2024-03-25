import React, { useContext } from "react";
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
        <Link className="dropdown-item" to="/admin/panel/inicio">
          <button className="btn btn-warning">Panel anterior</button>
        </Link>
      </li>

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
              <Link className="dropdown-item" to="habilitar/todos">
                Habilitar
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="habilitar/convencional">
                Habilitar Convencional
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="habilitar/adaptada">
                Habilitar Adaptada
              </Link>
            </li>
            <li>
              <Link className="dropdown-item border-top" to="habilitar/faltas">
                Faltas
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="habilitar/certificado">
                Certificado
              </Link>
            </li>
            <li>
              <Link className="dropdown-item border-top" to="usuario/feeds">
                Feeds
              </Link>
            </li>
          </ul>
        </li>
      )}
    </nav>
  );
}

export default Header;
