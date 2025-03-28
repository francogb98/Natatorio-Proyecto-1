import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  HomePrueba,
  Feeds,
  UserPerfil,
  PeticionesLayout,
} from "../components/prueba/index";

import PublicRoutes from "../public/routes/PublicRoutes";
import PrivateRoutes from "../components/prueba/private/routes/PrivateRoutes";
import QrPage from "../components/prueba/qr/QrPage";

function Routing() {
  const { auth, restart, setRecargando } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setRecargando(true);
      restart();
    }
  }, []);

  if (!auth.logged)
    return (
      <div>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
    );

  if (auth.logged)
    return (
      <Routes>
        {auth.logged &&
          (auth.role === "usuario" || auth.role === "registrado") && (
            <Route path="/*" element={<PublicRoutes />} />
          )}
        {(auth.logged && auth.role === "ADMINISTRATIVO") ||
        (auth.logged && auth.role === "PROFESOR") ||
        (auth.logged && auth.role === "GUARDAVIDA") ||
        (auth.logged && auth.role === "SUPER_ADMIN") ? (
          <>
            <Route path="/" element={<HomePrueba />}>
              <Route path="/dashboard/*" element={<PrivateRoutes />} />
              <Route path="qr" element={<QrPage />} />
              <Route path="usuario/:id" element={<UserPerfil />} />
              <Route path="usuario/feeds" element={<Feeds />} />
              <Route path="peticiones" element={<PeticionesLayout />} />

              {/* Rutas privadas dentro de HomePrueba */}
            </Route>
          </>
        ) : (
          <Route
            path="*"
            element={
              <div>
                <h1>Acceso Denegado</h1>
                <h2>No tienes permisos para acceder a esta pagina</h2>
                <button
                  className="btn btn-lg btn-warning"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Volver al inicio
                </button>
              </div>
            }
          />
        )}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    );
}

export default Routing;
