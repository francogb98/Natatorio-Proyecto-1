import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./home.module.css";

function NavBar() {
  const { cerrarSesion } = useContext(AuthContext);
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <button
        className={`btn btn-primary ${style.buttonMenu}`}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
        style={{ position: "fixed", top: "0", left: "0", height: "50px" }}
      >
        Mostrar Menu
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        style={{ width: "250px" }}
      >
        <div className={`offcanvas-header ${style.header}`}>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        {/* <div className="offcanvas-body"> */}
        <nav className={style.navBar}>
          <Link to="panel/inicio" className={style.link}>
            Inicio
          </Link>
          <Link to="panel/piletas" className={style.link}>
            Piletas
          </Link>
          <Link to="panel/usuarios" className={style.link}>
            Lista Usuarios
          </Link>

          <Link to="panel/buscar-usuario" className={style.link}>
            Buscar Usuario
          </Link>

          <Link to="panel/habilitar-usuario" className={style.link}>
            Habilitar Usuario
          </Link>

          <Link to="panel/create" className={style.link}>
            Crear Actividad
          </Link>
          <Link to="panel/actividades" className={style.link}>
            Lista Actividades
          </Link>
          <Link to="panel/estadisticas" className={style.link}>
            Estadisticas{" "}
          </Link>

          {/* boton para cerrar secion */}
          <div className="py-2 px-1">
            <button onClick={cerrarSesion} className="btn btn-danger ">
              Cerrar Sesion
            </button>
          </div>
        </nav>
        {/* </div> */}
      </div>
    </div>
  );
}

export default NavBar;
