import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import FormularioBuscarUsuario from "./aside/FormularioBuscarUsuario";
import Header from "./Header";

function HomePrueba() {
  const { pathname } = useLocation();

  console.log(pathname);

  return (
    <div className="container-fluid">
      {pathname === "/qr" ? (
        <Outlet />
      ) : (
        <>
          <header className="row fixed-top bg-light border-bottom border-dark">
            <Header />
          </header>

          <main
            className="row"
            style={{
              marginTop: "50px",
              marginBottom: "100px",
            }}
          >
            <div className="col-12 col-sm-4">
              <FormularioBuscarUsuario />
            </div>
            <div className="col-12 col-sm-8 mt-3">
              <Outlet />
            </div>
          </main>
          <footer className="row fixed-bottom border-top border-dark d-none d-md-block">
            <Footer />
          </footer>
        </>
      )}
    </div>
  );
}

export { HomePrueba };
