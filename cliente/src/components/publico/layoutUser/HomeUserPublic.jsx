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

  if (getUser.isSuccess && !getUser.data) {
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
          <h4>
            Bienvienida{" "}
            <span>
              {user.nombre} {user.apellido}
            </span>
          </h4>
          <h5>
            Numero de usuario :{" "}
            <span className="text-danger">{user.customId}</span>
          </h5>

          {/* <Link to={"notificaciones"} className={style.link}>
            {location.pathname === "/user/notificaciones" ? (
              <i type="button" class="bi bi-bell  position-relative">
                <span class="position-absolute top-0 start-80 translate-middle p-2 bg-danger border border-light rounded-circle">
                  <span class="visually-hidden">New alerts</span>
                </span>
              </i>
            ) : (
              <i class="bi bi-bell"></i>
            )}
          </Link> */}
          <hr />
        </header>

        <main className="mt-3">
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
        </main>

        <footer>
          <NavBar user={user} location={location} />
        </footer>
        {/* <Outlet /> */}
      </div>
    );
  }
}

export default HomeUserPublic;
