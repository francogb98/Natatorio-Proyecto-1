import style from "./home.module.css";
import { Outlet, useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import FormularioBuscarUsuario from "./Inicio/turnoActual/FormularioBuscarUsuario";
import NuevoTurno from "./NuevoTurno";

function Home() {
  const location = useLocation();

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
          {(location.pathname.startsWith("/admin/panel/inicio") ||
            location.pathname === "/admin/panel/listaAutorizados" ||
            location.pathname === "/admin/panel/piletas") && <NuevoTurno />}

          <FormularioBuscarUsuario />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
