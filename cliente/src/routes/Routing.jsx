import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Registro from "../components/publico/registro/Registro";
import SignIn from "../components/publico/inicioDeSesion/SignIn";

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

import {
  EditarPerfil,
  HomeUser,
  Inscripcion,
  LayoutUser,
  Notificaciones,
  Publico,
  UpdateFiles,
} from "../components/publico";

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
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/" element={<Inicio_prueba />} /> */}
          <Route path="/login" element={<Registro />} />
          <Route
            path="/recuperar-contraseña"
            element={<RecuperarContraseña />}
          />
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
        </Routes>
      </div>
    );

  if (auth.logged)
    return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<Registro />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />

        {auth.logged &&
          (auth.role === "usuario" || auth.role === "registrado") && (
            <>
              <Route path="/vistaPrueba" element={<Publico />} />
              <Route path="/user" element={<Publico />}>
                <Route path="home" element={<HomeUser />} />
                <Route path="perfil/updateFiles" element={<UpdateFiles />} />
                <Route path="inscripcion" element={<Inscripcion />} />
                <Route path="perfil" element={<LayoutUser />} />
                <Route path="perfil/editarPerfil" element={<EditarPerfil />} />
                <Route path="notificaciones" element={<Notificaciones />} />
              </Route>
            </>
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
