import QrScanner from "qr-scanner"; // if installed via package and bundling with a module bundler like webpack or rollup

import React, { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useMutation } from "react-query";
import { PiletaFetch } from "../../../helpers/piletas/Pileta-Fetch";

import style from "./style.module.css";
import { QrFetch } from "../../../helpers/qr";

const QrCodeScanner = () => {
  const [result, setResult] = useState("");

  const {
    auth: { user },
  } = useContext(AuthContext);

  const agregarUsuario = useMutation({
    mutationFn: QrFetch.asistenciaPorQr,
  });
  const [isOpen, setIsOpen] = useState(false);

  const videoRef = useRef(null);

  const handleSubmit = (codigoQR) => {
    if (user.activity.length > 0) {
      agregarUsuario.mutate(
        {
          customId: user.customId,
        },
        {
          onSuccess: (data) => {
            if (data.status === "success") {
              Swal.fire({
                icon: "success",
                title: "Usuario Autorizado",
                html: `
                <p>Usuario: <h3>${user.nombre} ${user.apellido}</h3></p>
                <br/>
                <p>Asistencia registrada en el día de la fecha: <h3>${codigoQR}</h3></p>
                <br/>
                <p>
                  Actividad: <b>${user.activity[0].name}</b> <br/>
                  Horario: <b>${user.activity[0].hourStart} - ${user.activity[0].hourFinish}</b>
                </p>
              `,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Usuario no autorizado",
                text: data.message,
              });
            }
          },
        }
      );
      setIsOpen(false);
    } else {
      setIsOpen(false);
      Swal.fire({
        icon: "error",
        title: "Usuario no está inscripto en ninguna actividad",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setResult(result.data);
          handleSubmit(result.data);

          qrScanner.stop();
        },
        {
          onDecodeError: (error) => {},
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start();

      // Limpieza al desmontar el componente
      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [isOpen]);

  return (
    <div>
      {!isOpen && (
        <div className="d-flex flex-column text-center">
          <button
            className={`${style.btn__help}`}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <i
              class="bi bi-qr-code-scan"
              style={{
                fontSize: "50px",
              }}
            ></i>
          </button>
        </div>
      )}

      {isOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <button
              className={style.closeButton}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <video
              ref={videoRef}
              style={{ width: "100%", height: "auto" }}
            ></video>
          </div>
        </div>
      )}
      {agregarUsuario.isLoading && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className="text-white text-center">
              Registrando Asistencia...
            </h2>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <div
                className="spinner-border text-primary"
                style={{
                  height: "35px",
                  width: "35px",
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;
