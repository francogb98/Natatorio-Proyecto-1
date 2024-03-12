import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { auth, cerrarSesion } = useContext(AuthContext);

  return (
    <nav className="nav justify-content-around">
      <li
        class="nav-item dropdown"
        style={{
          listStyle: "none",
        }}
      >
        <a
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Piletas
        </a>
        <ul class="dropdown-menu">
          <li>
            <Link class="dropdown-item" to="/home">
              Lista
            </Link>
          </li>
          <li>
            <Link class="dropdown-item" to="/home/buscar">
              Buscar
            </Link>
          </li>
        </ul>
      </li>
      {auth.role == "SUPER_ADMIN" && (
        <li
          class="nav-item dropdown"
          style={{
            listStyle: "none",
          }}
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Actividades
          </a>
          <ul class="dropdown-menu">
            <li>
              <Link class="dropdown-item" to="actividades">
                Lista
              </Link>
            </li>
            <li>
              <Link class="dropdown-item" to="actividades/create">
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
          class="nav-item dropdown"
          style={{
            listStyle: "none",
          }}
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Usuarios
          </a>
          <ul class="dropdown-menu">
            <li>
              <Link class="dropdown-item" to="habilitar-usuario">
                Habilitar
              </Link>
            </li>
            <li>
              <Link class="dropdown-item" to="habilitar-usuario-adaptada">
                Habilitar Adaptada
              </Link>
            </li>
          </ul>
        </li>
      )}
    </nav>
  );
}

export default Header;
