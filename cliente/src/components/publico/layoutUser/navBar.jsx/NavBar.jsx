import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import style from "./navBar.module.css";
import { AuthContext } from "../../../../context/AuthContext";

function NavBar({ user }) {
  const location = useLocation();

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

      <Link to={`inscripcion`} className={style.link}>
        <i
          className="bi bi-calendar2-check"
          type="button"
          style={{
            color: "green",
          }}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></i>
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

      <Link to={"notificaciones"} className={style.link}>
        {location.pathname === "/user/notificaciones" ? (
          <i className="bi bi-bell-fill position-relative">
            {
              //si hay notificaciones sin leer
              user.notificaciones?.filter(
                (notificacion) => notificacion.leido === false
              ).length > 0 && (
                <span className="position-absolute top-10 start-80 translate-middle p-2 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              )
            }
          </i>
        ) : (
          <i type="button" className="bi bi-bell  position-relative">
            {
              //si hay notificaciones sin leer
              user.notificaciones?.filter(
                (notificacion) => notificacion.leido === false
              ).length > 0 && (
                <span className="position-absolute top-0 start-80 translate-middle p-2 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              )
            }
          </i>
        )}
        <p type="button" data-bs-dismiss="offcanvas" aria-label="Close">
          Notificaciones
        </p>
      </Link>
    </div>
  );
}

export default NavBar;
