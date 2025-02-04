import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function CargarCerrarBotones() {
  const { cerrarSesion } = useContext(AuthContext);

  return (
    <>
      <div className="col-6 d-flex justify-content-center">
        <button
          className="btn w-100 btn-outline-danger fw-bold"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#loadFileModal"
        >
          <i className="bi bi-upload me-1"></i>
          <span>Cargar Archivos</span>
        </button>
      </div>

      <div className="col-6 d-flex justify-content-center">
        <button
          className="btn w-100 btn-outline-warning fw-bold text-black"
          onClick={() => cerrarSesion()}
        >
          <i className="bi bi-box-arrow-right me-1"></i>
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </>
  );
}

export default CargarCerrarBotones;
