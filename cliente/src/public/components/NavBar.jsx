import { Link, NavLink } from "react-router-dom";

import style from "../styles/NavBar.module.css";
import logo from "../../assets/Logo.png";
import avatar from "../../assets/avatar.webp";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import { routesModel } from "../models";

function NavBar() {
  const { auth } = useContext(AuthContext);

  const notificacionesNoLeidas = auth.user?.notificaciones?.filter(
    (notif) => !notif.leido
  ).length;

  if (auth.logged) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className={`container ${style.navBar}`}>
          {/* Logo alineado a la izquierda */}
          <Link to="/">
            <img src={logo} alt="logo" className={`${style.logo} img-fluid`} />
          </Link>

          {/* Botones alineados a la derecha */}
          <div className="d-flex gap-2 align-items-center justify-content-end">
            {/* Ícono de campana con badge si hay notificaciones no leídas */}
            <Link to="/user/notificaciones" className="position-relative">
              <i className="bi bi-bell fs-4"></i>
              {notificacionesNoLeidas > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notificacionesNoLeidas}
                  <span className="visually-hidden">
                    Notificaciones no leídas
                  </span>
                </span>
              )}
            </Link>

            <NavLink
              to={`/${routesModel.user.root}/${routesModel.user.actividades}`}
            >
              <div className="d-flex mt-2">
                <span className="me-2 text-dark">
                  <i className="bi bi-list fs-3"></i>
                </span>
                <img
                  className="rounded-circle"
                  src={auth.user.foto ? auth.user.foto : avatar}
                  alt="perfil"
                  style={{ width: "45px", height: "45px" }}
                />
              </div>
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={style.nav__container}>
      {/* Logo alineado a la izquierda */}
      <div className={style.logo__container}>
        <Link to="/">
          <img src={logo} alt="logo" className={`${style.logo}`} />
        </Link>
      </div>

      {/* Botones alineados a la derecha */}
      <div className="d-flex justify-content-between">
        <div>
          <NavLink to="/" className="btn btn-outline-primary fw-bold">
            {" "}
            Actividades
          </NavLink>
        </div>
        <div className="d-flex gap-2">
          <NavLink
            to="/login"
            className="btn btn-outline-success fw-bold"
            style={{ height: "fit-content" }}
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            {" "}
            Ingresar
          </NavLink>
          <NavLink
            to="/register"
            className="btn btn-outline-danger fw-bold"
            style={{ height: "fit-content" }}
          >
            Registrarse
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
