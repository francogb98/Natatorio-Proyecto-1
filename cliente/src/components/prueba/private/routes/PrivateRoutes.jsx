import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/users/UserList";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="user-list/:filtro" element={<UserList />} />
      </Route>
    </Routes>
  );
}

export default PrivateRoutes;
