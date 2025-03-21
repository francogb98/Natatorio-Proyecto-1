import { Outlet } from "react-router-dom";
import { ModalArchivos } from "../../../../public/components/Modal/ModalArchivos";
import { Toaster } from "sonner";

function Dashboard() {
  return (
    <div>
      <Outlet />

      <ModalArchivos />

      <Toaster />
    </div>
  );
}

export default Dashboard;
