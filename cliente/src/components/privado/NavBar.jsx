import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { useLocation } from "react-router-dom";

import style from "./home.module.css";

function NavBar() {
  const { cerrarSesion } = useContext(AuthContext);

  const location = useLocation();
  return (
    <nav className={style.menu}>
      <Link to="panel/inicio" className={style.link}>
        {location.pathname === "/admin/panel/inicio" ? (
          <i className="bi bi-house-fill"></i>
        ) : (
          <i className="bi bi-house"></i>
        )}
        Inicio
      </Link>

      <Link to="panel/piletas" className={style.link}>
        {
          location.pathname === "/admin/panel/piletas" ? (
            <i className="bi bi-tablet-landscape-fill"></i>
          ) : (
            <i className="bi bi-tablet-landscape"></i>
          )
          // <i className="bi bi-swimming"></i>
        }
        Piletas
      </Link>

      <Link to="panel/estadisticas" className={style.link}>
        Estadisticas{" "}
      </Link>

      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actividades
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link to="panel/create" className={style.link}>
              Crear Actividad
            </Link>
          </li>
          <li>
            <Link to="panel/actividades" className={style.link}>
              Lista Actividades
            </Link>
          </li>
        </ul>
      </div>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Usuarios
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link to="panel/usuarios" className={style.link}>
              {location.pathname === "/admin/panel/usuarios" ? (
                <i className="bi bi-person-lines-fill"></i>
              ) : (
                <i
                  className="bi bi-person-lines-fill"
                  style={{ color: "red" }}
                ></i>
              )}
              Lista Usuarios
            </Link>
          </li>
          <li>
            {" "}
            <Link to="panel/buscar-usuario" className={style.link}>
              Buscar Usuario
            </Link>
          </li>
          <li>
            {" "}
            <Link to="panel/habilitar-usuario" className={style.link}>
              Habilitar Usuario
            </Link>
          </li>
        </ul>
      </div>

      <div className="py-2 px-1">
        <button onClick={cerrarSesion} className="btn btn-danger ">
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
