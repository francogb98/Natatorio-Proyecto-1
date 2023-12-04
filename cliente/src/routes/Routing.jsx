import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "react-query";
import { getInfoUser } from "../helpers/fetch";

import HomeUserPublic from "../components/publico/layoutUser/HomeUserPublic";
import Registro from "../components/publico/registro/RegistroPrueba";
import Confirm from "../components/publico/confirmEmail/ConfirmEmail";
import SignIn from "../components/publico/inicioDeSesion/SignIn";
import Inscripcion from "../components/publico/layoutUser/inscripcion/Inscripcion";
import Perfil from "../components/publico/layoutUser/perfil/Perfil";
import Home from "../components/privado/Home";
import Inicio from "../components/privado/Inicio/Inicio";

import CreateActivity from "../components/privado/createActivity/CreateActivity";
import SearchUser from "../components/privado/searchUser/SearchUser";
import Habilitar from "../components/privado/habilitarUsuario/Habilitar";
// import Piletas from "../components/privado/Piletas/Piletas";
import ListaUsuarios from "../components/privado/listaUsuarios/ListaUsuarios";
import Estadisticas from "../components/privado/estadisticas/Estadisticas";
import ListActivity from "../components/privado/actividadesLista/ListActivity";
import UpdateFiles from "../components/publico/layoutUser/updateFiles/UpdateFiles";
import HomeUser from "../components/publico/layoutUser/home/HomeUser";
import User from "../components/privado/UserInfo/User";
import PiletasInfo from "../components/privado/showPiletasInfo/PiletasInfo";
import Notificaciones from "../components/publico/layoutUser/notificaciones/Notificaciones";
import EditarPerfil from "../components/publico/layoutUser/perfil/EditarPerfil";

function Routing() {
  const { auth, dispatch } = useContext(AuthContext);
  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
  });

  useEffect(() => {
    if (getUser.data?.status === "success" && !auth.logged) {
      dispatch({
        type: "LOGIN",
        payload: {
          logged: true,
          role: getUser.data.user.role,
          user: getUser.data.user,
        },
      });
    }
  }, [getUser.data]);

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/login" element={<Registro />} />

      <Route path="/verificar-cuenta" element={<Confirm />} />
      {auth.logged &&
      (auth.role === "usuario" || auth.role === "registrado") ? (
        <Route path="/user" element={<HomeUserPublic />}>
          <Route path="home" element={<HomeUser />} />
          <Route path="updateFiles" element={<UpdateFiles />} />
          <Route path="inscripcion" element={<Inscripcion />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="editarPerfil" element={<EditarPerfil />} />
          <Route path="notificaciones" element={<Notificaciones />} />
        </Route>
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
      {(auth.logged && auth.role === "ADMIN") ||
      (auth.logged && auth.role === "SUPER_ADMIN") ? (
        <Route path="/admin" element={<Home />}>
          <Route path="panel/inicio" element={<Inicio />} />
          <Route path="panel/piletas" element={<PiletasInfo />} />
          <Route path="panel/create" element={<CreateActivity />} />
          <Route path="panel/actividades" element={<ListActivity />} />
          <Route path="panel/buscar-usuario" element={<SearchUser />} />
          <Route path="panel/habilitar-usuario" element={<Habilitar />} />
          <Route path="panel/usuario/:id" element={<User />} />
          <Route path="panel/usuarios" element={<ListaUsuarios />} />
          <Route path="panel/estadisticas" element={<Estadisticas />} />
        </Route>
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
