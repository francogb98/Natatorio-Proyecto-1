import React, { useContext } from "react";
import { Link } from "react-router-dom";

import style from "./navBar.module.css";
import { AuthContext } from "../../../../context/AuthContext";

function NavBar({ user, location }) {
  const { cerrarSesion } = useContext(AuthContext);

  return (
    <div className={style.body}>
      <Link to={"home"} className={style.link}>
        {location.pathname === "/user/home" ? (
          <i className="bi bi-house-door-fill"></i>
        ) : (
          <i className="bi bi-house-door"></i>
        )}
      </Link>
      <Link to={"updateFiles"} className={style.link}>
        {location.pathname === "/user/updateFiles" ? (
          <i className="bi bi-file-earmark-arrow-up-fill"></i>
        ) : (
          <i className="bi bi-file-earmark-arrow-up"></i>
        )}
      </Link>
      <Link
        to={`${
          user.certificadoHongos == undefined || user.fichaMedica == undefined
            ? "home"
            : "inscripcion"
        }`}
        className={style.link}
      >
        {user.certificadoHongos == undefined ||
        user.fichaMedica == undefined ? (
          <i className="bi bi-calendar-x-fill"></i>
        ) : location.pathname === "/user/inscripcion" ? (
          <i className="bi bi-calendar2-check-fill"></i>
        ) : (
          <i className="bi bi-calendar2-check"></i>
        )}
      </Link>
      <Link to={"perfil"} className={style.link}>
        {location.pathname === "/user/perfil" ? (
          <i className="bi bi-person-fill"></i>
        ) : (
          <i className="bi bi-person"></i>
        )}
      </Link>

      <Link to={"/"} className={style.link}>
        <i onClick={() => cerrarSesion()} className="bi bi-box-arrow-left"></i>
      </Link>
    </div>
  );
}

export default NavBar;
