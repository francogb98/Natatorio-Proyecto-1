import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Registro from "../components/publico/registro/RegistroPrueba";
import SignIn from "../components/publico/inicioDeSesion/SignIn";
import Inscripcion from "../components/publico/layoutUser/inscripcion/Inscripcion";
import Feed from "../components/publico/layoutUser/perfil/Feed";

import UpdateFiles from "../components/publico/layoutUser/updateFiles/UpdateFiles";
import HomeUser from "../components/publico/layoutUser/home/HomeUser";
import Notificaciones from "../components/publico/layoutUser/notificaciones/Notificaciones";
import EditarPerfil from "../components/publico/layoutUser/perfil/EditarPerfil";
import RecuperarContraseña from "../components/publico/recuperarContraseña/RecuperarContraseña";
import Publico from "../components/publico/vistas/Publico";
import LayoutUser from "../components/prueba_publico/usuario/LayoutUser";
import Actividades_lista from "../components/prueba_publico/actividades/Actividades_lista";
import PruebaInscripciones from "../components/publico/layoutUser/inscripcion/PruebaInscripciones";

import HomePrueba from "../components/prueba/HomePrueba";
import Layout from "../components/prueba/piletas/buscarPileta/Layout";

import RegistroUsuarios from "../components/prueba/piletas/RegistroUsuarios";
import UserPerfil from "../components/prueba/users/userPerfil/UserPerfil";
import HabilitarConvencional from "../components/prueba/users/habilitarUsuario/HabilitarConvencional";
import Feeds from "../components/prueba/users/feeds/Feeds";

import ListActivity from "../components/prueba/actividades/ListActivity";
import InfoActividad from "../components/prueba/actividades/InfoActividad";
import CreateActivity_prueba from "../components/prueba/actividades/CreateActivity";

function Routing() {
  const { auth, restart, recargando, setRecargando } = useContext(AuthContext);

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
                <Route path="feedback" element={<Feed />} />
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
