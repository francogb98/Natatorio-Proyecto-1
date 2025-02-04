import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import NavBar from "../components/NavBar";
import CargarCerrarBotones from "../components/CargarCerrarBotones";
import InformacionArchivos from "../components/InformacionArchivos";

function Header() {
  const { pathname } = useLocation();
  const { auth, useUser } = useContext(AuthContext);
  const { data: user, isLoading, error } = useUser();
  return (
    <>
      <div className="row">
        <NavBar />
      </div>
      {auth.logged && (
        <div className="row mt-4">
          <CargarCerrarBotones />

          {pathname === "/" && <InformacionArchivos />}
        </div>
      )}
    </>
  );
}

export default Header;
