import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Registro from "../components/publico/registro/RegistroPrueba";
import SignIn from "../components/publico/inicioDeSesion/SignIn";
import Inscripcion from "../components/publico/layoutUser/inscripcion/Inscripcion";
import Perfil from "../components/publico/layoutUser/perfil/Perfil";
import Feed from "../components/publico/layoutUser/perfil/Feed";

import Home from "../components/privado/Home";

import Inicio from "../components/privado/Inicio/turnoActual/Inicio";
import FormularioTurnoSiguiente from "../components/privado/Inicio/turnoSiguiente/FormularioTurnoSiguiente";
import FormularioPrueba from "../components/privado/Inicio/autorizar/FormularioPrueba";
import ListaUsuarios from "../components/privado/usuario/listaUsuarios/ListaUsuarios";

import User from "../components/privado/usuario/UserInfo/User";
import SearchUser from "../components/privado/usuario/searchUser/SearchUser";
import Habilitar from "../components/privado/usuario/habilitarUsuario/Habilitar";

import CreateActivity from "../components/privado/actividades/createActivity/CreateActivity";
import ListActivity from "../components/privado/actividades/actividadesLista/ListActivity";

// import Piletas from "../components/privado/Piletas/Piletas";
import Estadisticas from "../components/privado/estadisticas/Estadisticas";
import UpdateFiles from "../components/publico/layoutUser/updateFiles/UpdateFiles";
import HomeUser from "../components/publico/layoutUser/home/HomeUser";
import Notificaciones from "../components/publico/layoutUser/notificaciones/Notificaciones";
import EditarPerfil from "../components/publico/layoutUser/perfil/EditarPerfil";
import PiletasInfo from "../components/privado/Inicio/showPiletasInfo/PiletasInfo";
import RecuperarContraseña from "../components/publico/recuperarContraseña/RecuperarContraseña";
import InfoActividad from "../components/privado/actividades/actividadesLista/InfoActividad";
import Publico from "../components/publico/vistas/Publico";
import HabilitarAdaptada from "../components/privado/usuario/habilitarUsuario/HabilitarAdaptada";
import FeedBacks from "../components/privado/feedback/FeedBacks";
import Autorizado from "../components/privado/autorizados/Autorizado";

import RegistroUsuarios from "../components/prueba/piletas/RegistroUsuarios";
import HomePrueba from "../components/prueba/HomePrueba";
import UserPerfil from "../components/prueba/users/userPerfil/UserPerfil";
import Layout from "../components/prueba/piletas/buscarPileta/Layout";
import CreateActivity_prueba from "../components/prueba/actividades/createActivity/CreateActivity";
import HabilitarConvencional from "../components/prueba/users/habilitarUsuario/HabilitarConvencional";
import Inicio_prueba from "../components/prueba_publico/Inicio_prueba";
import Feeds from "../components/prueba/users/feeds/Feeds";

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
                <Route path="perfil" element={<Perfil />} />
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
            <Route path="/admin" element={<Home />}>
              <Route path="panel/inicio" element={<Inicio />} />
              <Route
                path="panel/inicio/turno-siguiente"
                element={<FormularioTurnoSiguiente />}
              />
              <Route
                path="panel/inicio/autorizar"
                element={<FormularioPrueba />}
              />
              <Route path="panel/piletas" element={<PiletasInfo />} />

              <Route path="panel/create" element={<CreateActivity />} />
              <Route path="panel/actividades" element={<ListActivity />} />
              <Route
                path="panel/actividades/infoActividad/:id"
                element={<InfoActividad />}
              />
              <Route path="panel/buscar-usuario" element={<SearchUser />} />
              <Route path="panel/habilitar-usuario" element={<Habilitar />} />
              <Route
                path="panel/habilitar-usuario-adaptada"
                element={<HabilitarAdaptada />}
              />
              <Route path="panel/usuario/:id" element={<User />} />
              <Route path="panel/usuarios" element={<ListaUsuarios />} />
              <Route path="panel/estadisticas" element={<Estadisticas />} />
              <Route path="panel/feed" element={<FeedBacks />} />
              <Route path="panel/listaAutorizados" element={<Autorizado />} />
            </Route>

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
