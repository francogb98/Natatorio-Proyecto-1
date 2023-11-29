import React, { useEffect, useState } from "react";

import style from "./home.module.css";
import NavBar from "./navBar.jsx/NavBar";
import { Link, Outlet } from "react-router-dom";
import { getInfoUser } from "../../../helpers/fetch";
import { useQuery } from "react-query";

import { useLocation } from "react-router-dom";
import HomeUser from "./home/HomeUser";
import Inscripcion from "./inscripcion/Inscripcion";
import Perfil from "./perfil/Perfil";
import UpdateFiles from "./updateFiles/UpdateFiles";
import Notificaciones from "./notificaciones/Notificaciones";

function HomeUserPublic() {
  //cargar datos de usuario

  const [user, setUser] = useState({});

  const location = useLocation();

  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        return data;
      }
    },
  });

  useEffect(() => {
    if (getUser.data) {
      setUser(getUser.data.user);
    }
  }, [getUser.data]);

  if (getUser.isError) {
    return (
      <div className={style.containerHome}>
        {location.pathname === "/user/home" ? (
          <>
            <header>
              <h1>Usuario no encontrado </h1>
              <button
                onClick={() => {
                  getUser.refetch();
                }}
                className="btn btn-primary"
              >
                Recargar
              </button>
            </header>

            <main>
              <h1>Usuario no encontrado </h1>
              <button
                onClick={() => {
                  getUser.refetch();
                }}
                className="btn btn-primary"
              >
                Recargar
              </button>
            </main>
          </>
        ) : null}

        {/* <Outlet /> */}
      </div>
    );
  }

  if (getUser.isLoading) {
    return (
      <div className={style.containerHome}>
        {location.pathname === "/user/home" ? (
          <>
            <h1>Cargando informacion de usuario...</h1>
          </>
        ) : null}

        {/* <Outlet /> */}
      </div>
    );
  }

  if (getUser.isSuccess) {
    return (
      <div className={style.containerHome}>
        <header className={style.header}>
          <Link to={"home"} className={style.info}>
            <img src={user.foto} alt="perfil" className={style.imgPerfil} />
            <h1>
              {user.nombre} {user.apellido}
            </h1>
          </Link>

          <div className={style.linksMenu}>
            <Link to={"notificaciones"} className={style.link}>
              {location.pathname === "/user/notificaciones" ? (
                <i className="bi bi-bell-fill">
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

            <button
              class="btn btn-warning"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasWithBothOptions"
              aria-controls="offcanvasWithBothOptions"
            >
              <i class="bi bi-list"></i>
            </button>
          </div>
        </header>

        <main className={style.main}>
          {location.pathname === "/user/home" ? <HomeUser user={user} /> : null}
          {location.pathname === "/user/inscripcion" ? (
            <Inscripcion user={user} />
          ) : null}
          {location.pathname === "/user/perfil" ? (
            <Perfil user={user}></Perfil>
          ) : null}
          {location.pathname === "/user/updateFiles" ? (
            <UpdateFiles user={user}></UpdateFiles>
          ) : null}
          {location.pathname === "/user/notificaciones" ? (
            <Notificaciones user={user}></Notificaciones>
          ) : null}
        </main>

        <footer>
          <div
            class="offcanvas offcanvas-start"
            data-bs-scroll="true"
            tabindex="-1"
            style={{
              width: "75%",
            }}
            id="offcanvasWithBothOptions"
            aria-labelledby="offcanvasWithBothOptionsLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
                <div className={style.info}>
                  <img
                    src={user.foto}
                    alt="perfil"
                    className={style.imgPerfil}
                  />
                  <h1>
                    {user.nombre} {user.apellido}
                  </h1>
                </div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <NavBar user={user} location={location} />
            </div>
          </div>
        </footer>
        {/* <Outlet /> */}
      </div>
    );
  }
}

export default HomeUserPublic;
