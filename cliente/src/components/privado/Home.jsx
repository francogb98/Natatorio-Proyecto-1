import React, { useContext } from "react";
import style from "./home.module.css";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Home() {
  const { cerrarSesion } = useContext(AuthContext);
  return (
    <div className={style.bodyHome}>
      <div>
        <nav className={style.navBar}>
          <Link to="/" className={style.link}>
            Inicio
          </Link>
          <Link to="/panel/piletas" className={style.link}>
            Piletas
          </Link>
          <Link to="/panel/usuarios" className={style.link}>
            Lista Usuarios
          </Link>

          <Link to="/panel/buscar-usuario" className={style.link}>
            Buscar Usuario
          </Link>

          <Link to="/panel/habilitar-usuario" className={style.link}>
            Habilitar Usuario
          </Link>

          <Link to="/panel/create" className={style.link}>
            Crear Actividad
          </Link>

          {/* boton para cerrar secion */}
          <div className="py-2 px-1">
            <button onClick={cerrarSesion} className="btn btn-danger ">
              Cerrar Sesion
            </button>
          </div>
        </nav>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
