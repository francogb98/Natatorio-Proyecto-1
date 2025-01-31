import { Link, NavLink } from "react-router-dom";

import style from "../styles/NavBar.module.css";
import logo from "../../assets/Logo.jpg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import { routesModel } from "../models";

function NavBar() {
  const { auth } = useContext(AuthContext);

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
            <NavLink
              to={`/${routesModel.user.root}/${routesModel.user.actividades}`}
            >
              <div className="d-flex mt-2">
                <span className="me-2 text-dark">
                  <i className="bi bi-list fs-3"></i>
                </span>
                <img
                  className="rounded-circle "
                  src={auth.user.foto}
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className={`container ${style.navBar}`}>
        {/* Logo alineado a la izquierda */}
        <Link to="/">
          <img src={logo} alt="logo" className={`${style.logo} img-fluid`} />
        </Link>

        {/* Botones alineados a la derecha */}
        <div className="d-flex gap-2">
          <NavLink
            className="btn btn-outline-success btn-sm btn-md btn-lg"
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
            className="btn btn-outline-danger btn-sm btn-md btn-lg"
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
