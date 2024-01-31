import { useQuery } from "react-query";
import { getInfoUser } from "../../../helpers/fetch";

import Header from "./Header";
import NavBar from "../layoutUser/navBar.jsx/NavBar";

import style from "./publico.module.css";
// import HomeUser from "../components/publico/layoutUser/home/HomeUser";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import HomeUser from "../layoutUser/home/HomeUser";
import Inscripcion from "../layoutUser/inscripcion/Inscripcion";
import Perfil from "../layoutUser/perfil/Perfil";
import UpdateFiles from "../layoutUser/updateFiles/UpdateFiles";
import Notificaciones from "../layoutUser/notificaciones/Notificaciones";
import EditarPerfil from "../layoutUser/perfil/EditarPerfil";
import Feed from "../layoutUser/perfil/Feed";

const routeComponents = {
  "/user/home": HomeUser,
  "/user/inscripcion": Inscripcion,
  "/user/perfil": Perfil,
  "/user/updateFiles": UpdateFiles,
  "/user/notificaciones": Notificaciones,
  "/user/editarPerfil": EditarPerfil,
  "/user/feedback": Feed,
};

function Publico() {
  const location = useLocation();

  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    onSuccess: (data) => {
      if (data.status === "success") {
      }
    },
  });

  if (getUser.isSuccess) {
    const currentPath = location.pathname;
    const ComponentToRender = routeComponents[currentPath];
    return (
      <div className={style.body}>
        <header className={style.header}>
          <Header user={getUser.data.user} />
          <NavBar user={getUser.data.user} />
        </header>
        <main className={style.main}>
          <section className={style.sectionMain}>
            {ComponentToRender ? (
              <ComponentToRender user={getUser.data.user} />
            ) : null}
          </section>
        </main>
        {/* <footer className={style.footer}>
          <NavBar user={getUser.data.user} />
        </footer> */}
      </div>
    );
  }
}

export default Publico;
