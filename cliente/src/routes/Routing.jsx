import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "react-query";
import { getInfoUser } from "../helpers/fetch";

import HomeUserPublic from "../components/publico/layoutUser/HomeUserPublic";
import Registro from "../components/publico/registro/Registro";
import Confirm from "../components/publico/confirmEmail/ConfirmEmail";
import SignIn from "../components/publico/inicioDeSesion/SignIn";
import Inscripcion from "../components/publico/layoutUser/inscripcion/Inscripcion";
import Perfil from "../components/publico/layoutUser/perfil/Perfil";
import Home from "../components/privado/Home";
import Inicio from "../components/privado/Inicio/Inicio";

import CreateActivity from "../components/privado/createActivity/CreateActivity";
import SearchUser from "../components/privado/searchUser/SearchUser";
import Habilitar from "../components/privado/habilitarUsuario/Habilitar";
import Piletas from "../components/privado/Piletas/Piletas";
import ListaUsuarios from "../components/privado/listaUsuarios/ListaUsuarios";
import Estadisticas from "../components/privado/estadisticas/Estadisticas";

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
      {auth.logged && auth.role === "usuario" ? (
        <Route path="/user" element={<HomeUserPublic />}>
          <Route path="inscripcion" element={<Inscripcion />} />
          <Route path="perfil" element={<Perfil />} />
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
          <Route path="panel/piletas" element={<Piletas />} />
          <Route path="panel/create" element={<CreateActivity />} />
          <Route path="panel/buscar-usuario" element={<SearchUser />} />
          <Route path="panel/habilitar-usuario" element={<Habilitar />} />
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

  // if (auth.logged && auth.role === "usuario") {
  //   return (
  //     <Routes>
  //       <Route path="/" element={<HomeUserPublic />}>
  //         <Route path="/" element={<Inscripcion />} />
  //         <Route path="/perfil" element={<Perfil />} />
  //       </Route>
  //       <Route path="*" element={<h1>Not Found</h1>} />
  //     </Routes>
  //   );
  // }
  // if (
  //   (auth.logged && auth.role === "ADMIN") ||
  //   (auth.logged && auth.role === "SUPER_ADMIN")
  // ) {
  //   return (
  //     <Routes>
  //       <Route path="/" element={<Home />}>
  //         <Route path="/" element={<Inicio />} />
  //         <Route path="/panel/piletas" element={<Piletas />} />
  //         <Route path="/panel/create" element={<CreateActivity />} />
  //         <Route path="/panel/buscar-usuario" element={<SearchUser />} />
  //         <Route path="/panel/habilitar-usuario" element={<Habilitar />} />
  //         <Route path="/panel/usuarios" element={<ListaUsuarios />} />
  //         <Route path="*" element={<h1>Not Found</h1>} />
  //       </Route>
  //     </Routes>
  //   );
  // }
  // if (!auth.logged) {
  //   return (
  //     <Routes>
  //       <Route path="/" element={<SignIn />} />
  //       <Route path="/login" element={<Registro />} />
  //       <Route path="/verificar-cuenta" element={<Confirm />} />
  //       <Route
  //         path="*"
  //         element={
  //           <div>
  //             <h1>Inicia sesion para poder acceder a este sitio</h1>
  //             <button
  //               className="btn btn-lg btn-warning"
  //               onClick={() => {
  //                 window.location.href = "/";
  //               }}
  //             >
  //               Volver al inicio
  //             </button>
  //           </div>
  //         }
  //       />
  //     </Routes>
  //   );
  // }
}

export default Routing;
