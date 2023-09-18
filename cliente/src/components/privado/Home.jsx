import React from "react";
import style from "./home.module.css";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";

function Home() {
  return (
    <div className={style.bodyHome}>
      <NavBar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
