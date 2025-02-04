import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

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

      <div className="row px-2 pb-2 mt-2">
        {pathname === "/" ? <Layout /> : <Outlet />}
      </div>
      <ModalDashboard />
      <Toaster />
    </div>
  );
}

export default Dashboard;
