import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  ModalArchivos,
  ModalHelpUser,
  ModalIniciarSesion,
  ModalLoadFiles,
} from "../components/Modal";
import HelpButton from "../components/Help/HelpButton";
import QrCodeScanner from "../components/qr-scanner/QrScanner-Prueba-2";

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
