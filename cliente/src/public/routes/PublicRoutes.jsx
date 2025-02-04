import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";

import {
  PageActividades,
  PageNotificaciones,
  PageUser,
  User,
} from "../pages/user";

import { routesModel } from "../models";
import OlvidarPassword from "../pages/OlvidarPassword/OlvidarPassword";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="register" element={<Register />} />
        <Route path="olvidar-password" element={<OlvidarPassword />} />
        <Route path="login" element={<Login />} />
        <Route path={routesModel.user.root} element={<User />}>
          <Route
            path={routesModel.user.actividades}
            element={<PageActividades />}
          />
          <Route path={routesModel.user.dashboard} element={<PageUser />} />
          <Route
            path={routesModel.user.notificaciones}
            element={<PageNotificaciones />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
