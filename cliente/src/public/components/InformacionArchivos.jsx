import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import style from "../styles/Archivos.module.css";
import TextArchivos from "./Archivos/TextArchivos";

function InformacionArchivos() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  return (
    <>
      <div>
        {user.activity?.map((activity, i) => (
          <div className="alert alert-info mt-3" key={activity._id}>
            <p className="h4 mb-3">
              ¡Inscripcion a la actividad
              <span className="text-success fw-bold mx-1">{activity.name}</span>
              realizada con exito! <br />
            </p>
            <p className="card-text fw-bold">
              Estado de Solicitud:{" "}
              <span
                className={`fw-bold ${
                  user.status ? "text-success" : "text-warning"
                }`}
              >
                {user.status ? "Aprobado" : "Pendiente"}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className={style.body}>
        <TextArchivos archivo={user.fichaMedica} label={"Ficha Medica"} />
        <TextArchivos archivo={user.fotoDocumento} label={"Documento"} />
        <TextArchivos
          archivo={user.certificadoHongos}
          label={"Certificado PyM"}
        />
      </div>
    </>
  );
}

export default InformacionArchivos;
