import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/users/UserList";

import { BuscarPileta, LayoutPileta } from "../pages/piletas";
import {
  Layout,
  ListaActividades,
  LayoutCrearActividad,
  LayoutEditar,
  InfoActividad,
} from "../pages/actividades";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        {/* Rutas hijas dentro del Dashboard */}
        <Route index element={<LayoutPileta />} />
        <Route path="buscar-pileta" element={<BuscarPileta />} />
        <Route path="user-list/:filtro" element={<UserList />} />

        {/* Sección de actividades */}
        <Route path="actividades/*" element={<Layout />}>
          <Route index element={<ListaActividades />} />
          <Route path="create" element={<LayoutCrearActividad />} />
          <Route path="editar/:id" element={<LayoutEditar />} />
          <Route path=":id" element={<InfoActividad />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default PrivateRoutes;
