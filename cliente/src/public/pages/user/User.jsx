import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

import { routesModel } from "../../models";

function User() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  return (
    <div className="container py-5">
      <div className="card w-100 pt-3">
        <img
          src={user.foto}
          className="card-img-top d-block mx-auto"
          style={{
            height: "250px",
            width: "250px",
          }}
        />
        <div className="card-body text-center">
          <h2 className="card-title">
            {user.nombre} {user.apellido}
          </h2>
          <p className="card-text fw-bold">
            Numero de Identificacion:
            <span className="text-danger ms-2 fs-2">{user.customId}</span>
          </p>
        </div>

        {/* APLICAR NAV EN EL USUARIO */}

        <ul className="nav nav-tabs">
          <li className={`nav-item `}>
            <NavLink
              className={`nav-link`}
              aria-current="page"
              to={routesModel.user.actividades}
            >
              Actividades
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={routesModel.user.dashboard}>
              Usuario
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={routesModel.user.notificaciones}>
              Notificaciones{" "}
            </NavLink>
          </li>
        </ul>

        <div className="card-body ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export { User };
