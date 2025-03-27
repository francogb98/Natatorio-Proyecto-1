import { Outlet, useLocation } from "react-router-dom";
import FormularioBuscarUsuario from "./aside/FormularioBuscarUsuario";
import Header from "./Header";

function HomePrueba() {
  const { pathname } = useLocation();

  // Estilos para el layout principal
  const mainStyle = {
    marginTop: "56px", // Altura del header
    height: "calc(100vh - 56px)", // Altura total menos el header
    overflow: "hidden",
  };

  const contentStyle = {
    height: "100%",
    overflowY: "auto",
  };

  if (pathname === "/qr") {
    return <Outlet />;
  }

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header fijo en la parte superior */}
      <header className="fixed-top shadow-sm">
        <Header />
      </header>

      {/* Contenido principal */}
      <main style={mainStyle} className="container-fluid">
        <div className="row h-100 g-0">
          {/* Barra lateral - Solo visible en pantallas medianas/grandes */}
          <aside className="d-none d-sm-block col-sm-4 col-md-3 bg-light border-end p-2 h-100 overflow-y-auto">
            <div className="sticky-top" style={{ top: "70px" }}>
              <FormularioBuscarUsuario />
            </div>
          </aside>

          {/* Área de contenido principal */}
          <div className="col-12 col-sm-8 col-md-9" style={contentStyle}>
            <div className="p-3">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { HomePrueba };
