import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/users/UserList";
import LayoutPileta from "../pages/piletas/LayoutPileta";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<LayoutPileta />} />
        <Route path="user-list/:filtro" element={<UserList />} />
      </Route>
    </Routes>
  );
}

export default PrivateRoutes;
