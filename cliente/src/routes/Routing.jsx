import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
import { AuthContext } from "../context/AuthContext";
import ListaUsuarios from "../components/privado/listaUsuarios/ListaUsuarios";

function Routing() {
  const { auth } = useContext(AuthContext);

  useEffect(() => {}, [auth]);

  if (auth.logged && auth.role === "usuario") {
    return (
      <Routes>
        <Route path="/" element={<HomeUserPublic />}>
          <Route path="/home/actividades" element={<Inscripcion />} />
          <Route path="/" element={<Perfil />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    );
  }
  if (
    (auth.logged && auth.role === "ADMIN") ||
    (auth.logged && auth.role === "SUPER_ADMIN")
  ) {
    return (
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/panel/piletas" element={<Piletas />} />
          <Route path="/panel/create" element={<CreateActivity />} />
          <Route path="/panel/buscar-usuario" element={<SearchUser />} />
          <Route path="/panel/habilitar-usuario" element={<Habilitar />} />
          <Route path="/panel/usuarios" element={<ListaUsuarios />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    );
  }
  if (!auth.logged) {
    return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<Registro />} />
        <Route path="/verificar-cuenta" element={<Confirm />} />
        <Route
          path="*"
          element={
            <div>
              <h1>Inicia sesion para poder acceder a este sitio</h1>
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
    );
  }
}

export default Routing;
