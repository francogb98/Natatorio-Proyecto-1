import React, { useContext } from "react";
import { Link } from "react-router-dom";

import style from "./navBar.module.css";
import { AuthContext } from "../../../../context/AuthContext";

function NavBar() {
  const { cerrarSesion } = useContext(AuthContext);

  return (
    <div className={style.body}>
      <Link to={"inscripcion"} className={style.link}>
        Actividades
      </Link>
      <Link to={"perfil"} className={style.link}>
        Perfil
      </Link>

      <button className="btn btn-warning" onClick={() => cerrarSesion()}>
        Cerrar Sesion
      </button>
    </div>
  );
}

export default NavBar;
