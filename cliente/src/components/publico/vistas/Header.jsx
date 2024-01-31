import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import style from "./publico.module.css";
import { AuthContext } from "../../../context/AuthContext";

function Header({ user }) {
  const { cerrarSesion } = useContext(AuthContext);

  const [cerrarConfirmacion, setCerrarConfirmacion] = useState(false);

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

      <div
        className={style.link}
        onClick={() => {
          cerrarSesion();
        }}
      >
        <i className="bi bi-box-arrow-left"></i>

        <p
          style={{
            fontSize: "10px",
          }}
        >
          Cerrar Sesion
        </p>
      </div>
    </section>
  );
}

export default Header;
