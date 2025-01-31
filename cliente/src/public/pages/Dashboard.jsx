import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Layout from "./Actividades/Layout";
import { ModalIniciarSesion } from "../components/Actividades";
import CargarCerrarBotones from "../components/CargarCerrarBotones";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ModalLoadFiles from "../components/user/ModalLoadFiles";
import { Toaster } from "sonner";
import InformacionArchivos from "../components/InformacionArchivos";

function Dashboard() {
  const { pathname } = useLocation();

  const { auth } = useContext(AuthContext);

  return (
    <div className="container bg-light px-4">
      <div className="row">
        <NavBar />
      </div>
      {auth.logged && (
        <div className="row mt-3">
          <CargarCerrarBotones />
          <InformacionArchivos />
        </div>
      )}
      <div className="row pb-2 mt-2">
        {pathname === "/" ? <Layout /> : <Outlet />}
      </div>
      <ModalIniciarSesion />
      <ModalLoadFiles />

      <Toaster />
    </div>
  );
}

export default Dashboard;
