import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import style from "./navBar.module.css";
import { AuthContext } from "../../../../context/AuthContext";

function NavBar({ user, location }) {
  const { cerrarSesion } = useContext(AuthContext);

  const [cerrarConfirmacion, setCerrarConfirmacion] = useState(false);

  return (
    <>
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

        <div className={style.link}>
          <i
            className="bi bi-box-arrow-left"
            onClick={() => {
              setCerrarConfirmacion(true);
            }}
          ></i>
        </div>
      </div>

      {cerrarConfirmacion && (
        <div className={style.cerrarConfirmacion}>
          <div className={style.cerrarConfirmacion__body}>
            <h3>¿Desea cerrar sesión?</h3>
            <div className={style.cerrarConfirmacion__buttons}>
              <button
                className={style.button__cancel}
                onClick={() => {
                  setCerrarConfirmacion(false);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
              <button
                className={style.button__confirm}
                onClick={() => {
                  cerrarSesion();
                }}
              >
                <i className="bi bi-check-lg"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
