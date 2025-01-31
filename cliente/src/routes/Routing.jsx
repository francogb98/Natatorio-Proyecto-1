import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import RecuperarContraseña from "../components/publico/recuperarContraseña/RecuperarContraseña";

import {
  HomePrueba,
  RegistroUsuarios,
  CreateActivity_prueba,
  Feeds,
  HabilitarConvencional,
  InfoActividad,
  Layout,
  ListActivity,
  UserPerfil,
  PeticionesLayout,
} from "../components/prueba/index";

import Modificando from "../ModificandoPagina/Modificando";

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
          <Route path="/*" element={<Modificando />} />
        </Routes>
      </div>
    );

  if (auth.logged)
    return (
      <Routes>
        {auth.logged &&
          (auth.role === "usuario" || auth.role === "registrado") && (
            <Route path="/*" element={<Modificando />} />
          )}
        {(auth.logged && auth.role === "ADMINISTRATIVO") ||
        (auth.logged && auth.role === "PROFESOR") ||
        (auth.logged && auth.role === "GUARDAVIDA") ||
        (auth.logged && auth.role === "SUPER_ADMIN") ? (
          <>
            <Route path="home" element={<HomePrueba />}>
              <Route path="/home" element={<RegistroUsuarios />} />
              <Route path="/home/buscar" element={<Layout />} />
              <Route path="usuario/:id" element={<UserPerfil />} />
              <Route path="usuario/feeds" element={<Feeds />} />

              {/* actividades */}
              <Route path="actividades" element={<ListActivity />} />
              <Route
                path="actividades/infoActividad/:id"
                element={<InfoActividad />}
              />
              <Route
                path="actividades/create"
                element={<CreateActivity_prueba />}
              />

              <Route
                path="habilitar/:filtro"
                element={<HabilitarConvencional />}
              />
              <Route path="peticiones" element={<PeticionesLayout />} />
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
