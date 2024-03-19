import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import FormularioBuscarUsuario from "./buscar_usuario/FormularioBuscarUsuario";
import info_user_perfil from "./hooks/info_user_perfil";
import Header from "./Header";

function HomePrueba() {
  const { perfilUsuario, setPerfilUsuario, buscar_usuario } =
    info_user_perfil();

  return (
    <div className="container-fluid">
      <header className="row fixed-top bg-light border-bottom border-dark">
        <Header />
      </header>

      <main
        className="row mt-5"
        style={{
          marginBottom: "10px",
        }}
      >
        <div className="col-12 col-sm-4">
          <FormularioBuscarUsuario />
        </div>
        <div
          className="col-12 col-sm-8 overflow-scroll pb-3"
          style={{
            height: "90vh",
          }}
        >
          <Outlet />
        </div>
      </main>
      <footer className="row fixed-bottom border-top border-dark">
        <Footer />
      </footer>
    </div>
  );
}

export default HomePrueba;
