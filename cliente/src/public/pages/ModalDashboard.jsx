import { useContext, useEffect, useState } from "react";
import { ModalIniciarSesion } from "../components/Actividades";
import ModalArchivos from "../components/Archivos/ModalArchivos";
import HelpButton from "../components/Help/HelpButton";
import ModalHelpUser from "../components/Help/ModalHelpUser";
import ModalLoadFiles from "../components/user/ModalLoadFiles";
import { AuthContext } from "../../context/AuthContext";

function ModalDashboard() {
  const { auth, useUser } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(null);

  const openModal = () => {
    localStorage.setItem("modal", true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const modal = localStorage.getItem("modal");
    if (!modal) {
      localStorage.setItem("modal", true);
    }
    setIsModalOpen(modal === "true");
  }, []);
  return (
    <>
      <ModalIniciarSesion />
      <ModalLoadFiles />
      <ModalArchivos />
      {auth.logged && (
        <ModalHelpUser
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {auth.logged && (
        <>
          <HelpButton openModal={openModal} />
        </>
      )}
    </>
  );
}

export default ModalDashboard;
