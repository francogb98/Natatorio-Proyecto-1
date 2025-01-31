import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fechaHandler } from "../utils";

import style from "../styles/Archivos.module.css";

function InformacionArchivos() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  const { fechaVencimiento, diasFaltantes } = fechaHandler(
    user.fechaCargaCertificadoHongos
  );

  return (
    <div className={style.body}>
      <div className="d-flex  gap-2">
        <p className="fw-bold">Ficha Medica</p>
        {user.fichaMedica ? (
          <span className="text-success">
            Cargado <i className="bi bi-check-circle"></i>
          </span>
        ) : (
          <span className="text-danger">
            Falta Cargar <i className="bi bi-x-circle"></i>{" "}
          </span>
        )}
      </div>
      <div>
        <div className="d-flex gap-2">
          <p className="fw-bold">Documento</p>
          {user.fotoDocumento ? (
            <span className="text-success">
              Cargado <i className="bi bi-check-circle"></i>
            </span>
          ) : (
            <span className="text-danger">
              Falta Cargar <i className="bi bi-x-circle"></i>{" "}
            </span>
          )}
        </div>
      </div>
      <div>
        <div className="d-flex gap-2">
          <p className="fw-bold">Certificado PyM</p>
          {user.certificadoHongos ? (
            <div className="d-flex gap-2 justify-content-between w-75">
              <span className="text-success">
                Cargado <i className="bi bi-check-circle"></i>
              </span>
              <p>
                Vence:
                <span className="text-success fw-bold ps-1">
                  {fechaVencimiento}
                </span>
              </p>

              {diasFaltantes >= 1 ? (
                <p>
                  Dias restantes:
                  <span className="text-danger fw-bold ps-1">
                    {diasFaltantes}
                  </span>
                </p>
              ) : (
                <p className="text-danger fw-bold">
                  Expiro por favor renovar certificado
                </p>
              )}
            </div>
          ) : (
            <span className="text-danger">
              Falta Cargar <i className="bi bi-x-circle"></i>{" "}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default InformacionArchivos;
