import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "./Actividades/Layout";
import Header from "./Header";
import ModalDashboard from "./ModalDashboard";

function Dashboard() {
  const { pathname } = useLocation();

  return (
    <div
      className="container bg-light"
      style={{
        minHeight: "100vh",
      }}
    >
      <Header />

      <div
        className="row px-sm-5 pb-2"
        style={{
          marginTop: "30px",
        }}
      >
        {pathname === "/" ? <Layout /> : <Outlet />}
      </div>
      <ModalDashboard />
      <Toaster />
    </div>
  );
}

export default Dashboard;
