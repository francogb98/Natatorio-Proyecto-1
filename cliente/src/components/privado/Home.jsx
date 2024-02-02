import style from "./home.module.css";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";

function Home() {
  return (
    <div className={style.bodyHome}>
      <NavBar />

      <div className={style.main}>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
