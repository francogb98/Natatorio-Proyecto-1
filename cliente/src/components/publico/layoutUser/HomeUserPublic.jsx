import React, { useEffect, useState } from "react";

import style from "./home.module.css";
import NavBar from "./navBar.jsx/NavBar";
import { Outlet } from "react-router-dom";
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

  if (getUser.isLoading) {
    return (
      <div className={style.containerHome}>
        <header>Cargando...</header>

        <main>Cargando...</main>

        <footer>
          <NavBar />
        </footer>
        {/* <Outlet /> */}
      </div>
    );
  }

  return (
    <div className={style.containerHome}>
      <header>
        <img src={user.foto} alt="" width="100" />
        <h1>
          Bienvienida {user.nombre} {user.apellido}
        </h1>
        <hr />
      </header>

      <main>
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

export default HomeUserPublic;
