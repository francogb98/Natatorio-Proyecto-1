import React from "react";
import Inscripcion from "./inscripcion/Inscripcion";

import style from "./home.module.css";
import NavBar from "./navBar.jsx/NavBar";
import { Outlet } from "react-router-dom";

function HomeUserPublic() {
  return (
    <div className={style.containerHome}>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default HomeUserPublic;
