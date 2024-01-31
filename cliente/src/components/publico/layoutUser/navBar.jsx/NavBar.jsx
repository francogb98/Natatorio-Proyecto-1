import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import style from "./navBar.module.css";
import { AuthContext } from "../../../../context/AuthContext";

function NavBar({ user }) {
  const { cerrarSesion } = useContext(AuthContext);

  const location = useLocation();

  const [cerrarConfirmacion, setCerrarConfirmacion] = useState(false);

  return (
    <div className={style.body}>
      <Link to={"home"} className={style.link}>
        {location.pathname === "/user/home" ? (
          <i
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            className="bi bi-house-door-fill"
          ></i>
        ) : (
          <i
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            className="bi bi-house-door"
          ></i>
        )}
        <p type="button" data-bs-dismiss="offcanvas" aria-label="Close">
          Inicio
        </p>
      </Link>

      <Link
        to={
          user.certificadoHongos == undefined || user.fichaMedica == undefined
            ? null
            : `inscripcion`
        }
        className={style.link}
      >
        {user.certificadoHongos == undefined ||
        user.fichaMedica == undefined ? (
          <i
            className="bi bi-calendar-x"
            style={{
              color: "red",
            }}
          ></i>
        ) : location.pathname === "/user/inscripcion" ? (
          <i
            className="bi bi-calendar2-check-fill"
            style={{
              color: "green",
            }}
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></i>
        ) : (
          <i
            className="bi bi-calendar2-check"
            type="button"
            style={{
              color: "green",
            }}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></i>
        )}
        <p type="button" data-bs-dismiss="offcanvas" aria-label="Close">
          Actividades
        </p>
      </Link>

      <Link to={"perfil"} className={style.link}>
        {location.pathname === "/user/perfil" ? (
          <i
            className="bi bi-person-fill"
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></i>
        ) : (
          <i
            className="bi bi-person"
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></i>
        )}
        <p type="button" data-bs-dismiss="offcanvas" aria-label="Close">
          Perfil
        </p>
      </Link>

      <div
        className={style.link}
        onClick={() => {
          setCerrarConfirmacion(true);
        }}
      >
        <i className="bi bi-box-arrow-left"></i>

        <p>Cerrar Sesion</p>
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
    </div>
  );
}

export default NavBar;
