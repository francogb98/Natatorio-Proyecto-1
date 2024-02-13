import style from "./home.module.css";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";
import FormularioBuscarUsuario from "./Inicio/turnoActual/FormularioBuscarUsuario";

function Home() {
  return (
    <div className={style.bodyHome}>
      <NavBar />

      <div className={style.main}>
        <div
          style={{
            width: "100%",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <FormularioBuscarUsuario />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
