import { useContext, useState } from "react";
import { fechaHandler } from "../../utils";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";

function TextArchivos({ archivo, label }) {
  const {
    auth: { user },
    setImageModal,
  } = useContext(AuthContext);

  const [fecha, setFechaVencimiento] = useState("");
  const [dias, setDias] = useState("");

  useEffect(() => {
    if (label === "Certificado PyM" && archivo) {
      const { fechaVencimiento, diasFaltantes } = fechaHandler(
        user.fechaCargaCertificadoHongos
      );
      setDias(diasFaltantes);
      setFechaVencimiento(fechaVencimiento);
    }
  }, [archivo]);

  return (
    <div className="d-flex gap-2 mb-2">
      {archivo ? (
        <a
          className="fw-bold"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#modalArchivos"
          onClick={() => {
            setImageModal(archivo);
          }}
        >
          {label}
        </a>
      ) : (
        <p className="fw-bold">{label}</p>
      )}
      {archivo ? (
        label === "Certificado PyM" ? (
          <div className="d-flex gap-2 justify-content-between w-75">
            <span className="text-success">
              Cargado <i className="bi bi-check-circle"></i>
            </span>
            <p>
              Vence:
              <span className="text-success fw-bold ps-1">{fecha}</span>
            </p>

            {dias >= 1 ? (
              <p>
                Días restantes:
                <span className="text-danger fw-bold ps-1">{dias}</span>
              </p>
            ) : (
              <p className="text-danger fw-bold">
                Expiró, por favor renovar certificado
              </p>
            )}
          </div>
        ) : (
          <span className="text-success">
            Cargado <i className="bi bi-check-circle"></i>
          </span>
        )
      ) : (
        <span className="text-danger">
          Falta Cargar <i className="bi bi-x-circle"></i>
        </span>
      )}
    </div>
  );
}

export default TextArchivos;
