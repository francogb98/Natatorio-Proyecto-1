import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./home.module.css";

function NavBar() {
  const [show, setShow] = React.useState(true);

  const { auth, cerrarSesion } = useContext(AuthContext);

  return (
    <>
      <button
        className={style.btnMenu}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        <span className={style.textButton}>Menu</span>

        <i
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
          className="bi bi-list w-100"
        ></i>
      </button>

      <div
        className={`offcanvas offcanvas-start ${show ? "show" : null}`}
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
        style={{
          width: "320px",
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Menu
          </h5>
          <Link to="/home" className={style.link__item}>
            <button className="btn btn-warning">Panel Oficial</button>
          </Link>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setShow(false)}
          ></button>
        </div>
        <div className="offcanvas-body">
          <nav className={style.menu}>
            <ul>
              <li className={style.inicio}>Inicio</li>
              {auth.role === "PROFESOR" || auth.role === "GUARDAVIDA" ? null : (
                <>
                  <li className={style.link}>
                    <Link to="panel/inicio" className={style.link__item}>
                      Registrar Turno
                    </Link>
                  </li>
                  <li className={style.link__item__especial}>
                    <Link
                      to="panel/inicio/turno-siguiente"
                      className={style.link__item}
                    >
                      Registrar Turno Siguiente
                    </Link>
                  </li>
                  <li className={style.link__item__especial}>
                    <Link
                      to="panel/listaAutorizados"
                      className={style.link__item}
                    >
                      Autorizar
                    </Link>
                  </li>
                </>
              )}
              <li className={style.link}>
                <Link to="panel/piletas" className={style.link__item}>
                  Piletas
                </Link>
              </li>
              {/* {auth.role === "SUPER_ADMIN" && (
                <li className={style.link}>
                  <Link
                    to="panel/inicio/autorizar"
                    className={style.link__item}
                  >
                    Autorizar
                  </Link>
                </li>
              )} */}
            </ul>
            <ul>
              <li className={style.inicio}>Actividades</li>
              {auth.role === "SUPER_ADMIN" && (
                <li className={style.link}>
                  <Link to="panel/create" className={style.link__item}>
                    Crear Actividad
                  </Link>
                </li>
              )}
              <li className={style.link}>
                <Link to="panel/actividades" className={style.link__item}>
                  Lista Actividades
                </Link>
              </li>
            </ul>
            <ul>
              <li className={style.inicio}>Usuario</li>
              {auth.role === "SUPER_ADMIN" && (
                <>
                  <li className={style.link}>
                    <Link
                      to="panel/habilitar-usuario"
                      className={style.link__item}
                    >
                      Habilitar
                    </Link>
                  </li>
                  <li className={style.link}>
                    <Link
                      to="panel/habilitar-usuario-adaptada"
                      className={style.link__item}
                    >
                      Habilitar Usuarios Adaptada
                    </Link>
                  </li>
                </>
              )}
              {(auth.role === "SUPER_ADMIN" ||
                auth.role === "administrador") && (
                <li className={style.link}>
                  <Link to="panel/usuarios" className={style.link__item}>
                    Lista Usuarios
                  </Link>
                </li>
              )}
            </ul>
            {auth.role === "SUPER_ADMIN" && (
              <ul>
                <li className={style.inicio}>Feeds</li>
                <li className={style.link}>
                  <Link to="panel/feed" className={style.link__item}>
                    Ver Feeds
                  </Link>
                </li>
              </ul>
            )}

            <div className="py-2 px-1">
              <button
                onClick={cerrarSesion}
                className="btn btn-lg btn-warning d-block mx-auto "
              >
                Cerrar Sesion
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavBar;
