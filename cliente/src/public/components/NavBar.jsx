import { Link, NavLink } from "react-router-dom";

import style from "../styles/NavBar.module.css";
import logo from "../../assets/Logo.png";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import avatar from "../../assets/avatar.webp";

import { routesModel } from "../models/index.js";

function NavBar() {
  const { auth, cerrarSesion } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const notificacionesNoLeidas = auth.user?.notificaciones?.filter(
    (notif) => !notif.leido
  ).length;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (auth.logged) {
    return (
      // <nav className="navbar navbar-expand-lg navbar-light bg-light">
      //   <div className={`container ${style.navBar}`}>
      //     {/* Logo alineado a la izquierda */}
      //     <Link to="/">
      //       <img src={logo} alt="logo" className={`${style.logo} img-fluid`} />
      //     </Link>

      //     {/* Botones alineados a la derecha */}
      //     <div className="d-flex gap-2 align-items-center justify-content-end">
      //       {/* Ícono de campana con badge si hay notificaciones no leídas */}
      //       <Link to="/user/notificaciones" className="position-relative">
      //         <i className="bi bi-bell fs-4"></i>
      //         {notificacionesNoLeidas > 0 && (
      //           <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      //             {notificacionesNoLeidas}
      //             <span className="visually-hidden">
      //               Notificaciones no leídas
      //             </span>
      //           </span>
      //         )}
      //       </Link>

      //       <NavLink
      //         to={`/${routesModel.user.root}/${routesModel.user.actividades}`}
      //       >
      //         <div className="d-flex mt-2">
      //           <span className="me-2 text-dark">
      //             <i className="bi bi-list fs-3"></i>
      //           </span>
      //           <img
      //             className="rounded-circle"
      //             src={auth.user.foto ? auth.user.foto : avatar}
      //             alt="perfil"
      //             style={{ width: "45px", height: "45px" }}
      //           />
      //         </div>
      //       </NavLink>
      //     </div>
      //   </div>
      // </nav>

      //background negro
      <div>
        <>
          {open && (
            <div className={style.bgBlur} onClick={() => setOpen(false)}></div>
          )}

          <div
            className={`${style.menuLateral} ${open && style.menuLateralOpen}`}
          >
            <div className={style.menuLateralContent}>
              {/* header */}
              <div className="d-flex justify-content-between align-items-center mb-1 p-2">
                <NavLink
                  to={`/${routesModel.user.root}/${routesModel.user.actividades}`}
                  className={style.menuLateralItemPerfil}
                  onClick={() => setOpen(false)}
                >
                  <img
                    className="rounded-circle"
                    src={auth.user.foto ? auth.user.foto : avatar}
                    alt="perfil"
                  />
                  <div>
                    <span>
                      {auth.user.nombre} {auth.user.apellido}
                    </span>
                    <span>{auth.user.customId}</span>
                  </div>
                </NavLink>
                <button className={style.btn} onClick={() => setOpen(false)}>
                  X
                </button>
              </div>

              {/* Items */}
              <div className="d-flex flex-column">
                <NavLink
                  to="/"
                  className={style.menuLateralItem}
                  onClick={() => setOpen(false)}
                >
                  Inicio
                  <i class="bi bi-house"></i>
                </NavLink>
                <NavLink
                  to="/user/notificaciones"
                  className={style.menuLateralItem}
                  onClick={() => setOpen(false)}
                >
                  Notificaciones
                  <span className="position-relative">
                    <i className="bi bi-bell fs-4"></i>
                    {notificacionesNoLeidas !== 0 && (
                      <span className={style.menuLateralBadge}>
                        {notificacionesNoLeidas}
                        <span className="visually-hidden">
                          Notificaciones no leídas
                        </span>
                      </span>
                    )}
                  </span>
                </NavLink>
                <NavLink
                  to="/user/actividades"
                  className={style.menuLateralItem}
                  onClick={() => setOpen(false)}
                >
                  Mis Actividades
                  <i class="bi bi-card-list"></i>
                </NavLink>
                <NavLink
                  to="/user/dashboard"
                  className={style.menuLateralItem}
                  onClick={() => setOpen(false)}
                >
                  Configuracion
                  <i class="bi bi-gear"></i>
                </NavLink>
                <NavLink
                  to="/user/dashboard"
                  className={`${style.menuLateralItem} ${style.menuLateralItemDestacado}`}
                  onClick={() => setOpen(false)}
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#loadFileModal"
                >
                  Cargar Archivos
                  <i class="bi bi-upload"></i>
                </NavLink>

                <button
                  className={style.btn_outline_warning}
                  onClick={() => cerrarSesion()}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  <span>Cerrar Sesion</span>
                </button>
              </div>
            </div>
          </div>
        </>

        <div className={style.menuHamburguesa}>
          <div className="d-flex justify-content-between align-items-center pe-1">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className={`${style.logo} img-fluid`}
              />
            </Link>
            {!open && (
              <div className="d-none d-sm-flex align-items-center gap-2">
                <img
                  className="rounded-circle"
                  src={auth.user.foto ? auth.user.foto : avatar}
                  alt="perfil"
                  style={{
                    width: "45px",
                    height: "45px",
                    border: "2px solid #e9ecef",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <h5 className="pt-2">
                  {auth.user.nombre} {auth.user.apellido}
                  <span className="ms-2 text-danger">{auth.user.customId}</span>
                </h5>
              </div>
            )}

            {!open && (
              <button className={style.btn} onClick={() => setOpen(true)}>
                <p
                  className="d-none d-sm-block pt-3"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Menu
                </p>
                <i class="bi bi-list "></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className={style.nav__container}>
      {/* Logo alineado a la izquierda */}
      <div className={style.logo__container}>
        <Link to="/">
          <img src={logo} alt="logo" className={style.logo} />
        </Link>
      </div>

      {/* Botones alineados a la derecha */}
      <div className={`d-flex ${style.nav_buttons}`}>
        <div className="me-2">
          <NavLink
            to="/"
            className={`btn btn-outline-primary ${style.nav_button}`}
          >
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
            className={`btn btn-outline-danger ${style.nav_button}`}
          >
            Registrarse
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
