import Header from "./Header";
import NavBar from "../layoutUser/navBar.jsx/NavBar";
import style from "./publico.module.css";

import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";

function Publico() {
  const { auth } = useContext(AuthContext);

  return (
    <div className={style.body}>
      <header className={style.header}>
        <Header user={auth.user} />
        <NavBar user={auth.user} />
      </header>
      <main className={style.main}>
        <section className={style.sectionMain}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export { Publico };
