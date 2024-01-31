import React from "react";
import { Link, useLocation } from "react-router-dom";

import style from "./publico.module.css";

function Header({ user }) {
  const location = useLocation();
  return (
    <section className={style.sectionHeader}>
      <Link to={"home"} className={style.info}>
        <div>
          <h2
            style={{
              marginBottom: "-4px",
            }}
          >
            {user.nombre} {user.apellido}
          </h2>
          <p>
            Numero de usuario:{" "}
            <span
              className="text-danger fw-bold"
              style={{
                fontSize: "20px",
              }}
            >
              {user.customId}
            </span>
          </p>
        </div>
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
      </Link>
    </section>
  );
}

export default Header;
