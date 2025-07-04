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
        {!user.activity.length && (
          <div className="alert alert-info mt-3">
            Carga todos los archivos necesarios para la inscripcion a la
            actividad
          </div>
        )}
        <div className="d-flex justify-content-between">
          <TextArchivos archivo={user.fichaMedica} label={"Ficha Medica"} />

          <button
            className="btn btn-sm btn-danger"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#loadFileModal"
          >
            Cargar archivos
            <i class="bi bi-upload ms-1"></i>
          </button>
        </div>
        <TextArchivos archivo={user.fotoDocumento} label={"Documento"} />
        {user.natacionAdaptada && (
          <TextArchivos archivo={user.cud} label={"CUD"} />
        )}
        <TextArchivos archivo={user.foto} label={"Foto Perfil"} />
        <TextArchivos
          archivo={user.certificadoHongos}
          label={"Certificado PyM"}
        />
      </div>
    </>
  );
}

export default InformacionArchivos;
