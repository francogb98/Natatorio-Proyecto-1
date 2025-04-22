import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function CargarCerrarBotones() {
  const { cerrarSesion } = useContext(AuthContext);

  const location = useLocation();

  return (
    <>
      <div className="col-6 d-flex justify-content-center">
        {location.pathname === "/" ? (
          <button
            className="btn w-100 btn-outline-danger fw-bold"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#loadFileModal"
          >
            <i className="bi bi-upload me-1"></i>
            <span>Cargar Archivos</span>
          </button>
        ) : (
          //Boton para voler al inicio
          <Link className="btn w-100 btn-outline-primary fw-bold" to="/">
            <i className="bi bi-house me-1"></i>
            <span>Inicio</span>
          </Link>
        )}
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
