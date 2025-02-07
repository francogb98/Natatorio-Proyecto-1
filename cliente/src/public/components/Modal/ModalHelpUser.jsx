import style from "../Help/style.module.css";

import Logo from "../../../assets/Logo.png";
import Imagen from "../../../assets/Imagen_1.jpg";
import Imagen_2 from "../../../assets/Imagen_2.jpg";
import Imagen_3 from "../../../assets/Imagen_3.jpg";
import Imagen_4 from "../../../assets/Imagen_4.jpg";
import { useEffect, useState } from "react";

function ModalHelpUser({ isModalOpen, setIsModalOpen }) {
  const [pagina, setPagina] = useState(1);

  const closeModal = () => {
    localStorage.setItem("modal", false);
    setIsModalOpen(false);
    setPagina(1);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const handleClickNext = () => {
    if (pagina <= 5) {
      setPagina(pagina + 1);
    }
  };
  const handleClickPrevious = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  return (
    <>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={`modal fade ${isModalOpen ? "show" : ""} ${
          style.modal__container
        }`}
        id="ModalHelp"
        tabIndex="-1"
        aria-labelledby="ModalHelpLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className={`modal-dialog ${style.modal__dialog}`}>
          <div className="modal-content">
            <div className={`modal-body ${style.modal__body}`}>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <img src={Logo} alt="" className="w-75" />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={closeModal} // Usar la función para cerrar el modal
                  aria-label="Close"
                >
                  Cerrar
                </button>
              </div>

              <div className="d-flex justify-content-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 1 ? "active" : null
                      }`}
                      onClick={() => {
                        setPagina(1);
                      }}
                    >
                      1
                    </li>
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 2 ? "active" : null
                      }`}
                      onClick={() => {
                        setPagina(2);
                      }}
                    >
                      2
                    </li>
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 3 ? "active" : null
                      }`}
                      aria-current="page"
                      onClick={() => {
                        setPagina(3);
                      }}
                    >
                      3
                    </li>
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 4 ? "active" : null
                      }`}
                      aria-current="page"
                      onClick={() => {
                        setPagina(4);
                      }}
                    >
                      4
                    </li>
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 5 ? "active" : null
                      }`}
                      aria-current="page"
                      onClick={() => {
                        setPagina(5);
                      }}
                    >
                      5
                    </li>
                    <li
                      className={`breadcrumb-item ${
                        pagina !== 6 ? "active" : null
                      }`}
                      aria-current="page"
                      onClick={() => {
                        setPagina(6);
                      }}
                    >
                      6
                    </li>
                  </ol>
                </nav>
              </div>
              {pagina === 1 && (
                <>
                  <div className="mb-3">
                    <h2 className="text-center">
                      Bienvenido al Natatorio Olímpico Madre de Ciudades
                    </h2>

                    <p className="mt-5">
                      Nos complace darle la bienvenida a nuestra plataforma
                      oficial, donde podrá encontrar toda la información sobre
                      nuestras actividades, horarios y servicios. A
                      continuación, le explicaremos el funcionamiento de la
                      nueva página para que pueda navegar de manera sencilla y
                      aprovechar al máximo su experiencia con nosotros.
                    </p>
                  </div>
                </>
              )}
              {pagina === 2 && (
                <>
                  <h3>Inicio</h3>

                  <div className="mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <span className="text-danger me-1">(1)</span>
                        Presionando este icono podrás ingresar a las opciones
                        del usuario.
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(2)</span> En esta
                        sección podrás ver el estado de tus archivos y la fecha
                        de vencimiento del certificado de PyM.
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(3)</span>
                        Aquí podrás filtrar las actividades según su nombre,
                        hora o día (recuerda que solo se mostrarán las
                        actividades disponibles para tu edad).
                      </li>
                    </ul>
                  </div>
                  <div className={`w-100 ${style.imagen__container}`}>
                    <img src={Imagen} alt="imagen_1" className="w-100 h-100" />
                  </div>
                </>
              )}
              {pagina === 3 && (
                <>
                  <h3>Usuario - Actividades</h3>
                  <div className="mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <span className="text-danger me-1">(1)</span> En esta
                        sección veremos los datos principales del usuario y el
                        <b className="ms-1 me-1">número para ingresar</b>
                        al natatorio.
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(2)</span> Barra de
                        navegación para poder ver
                        <b className="ms-1">
                          Actividades, Datos de usuario y Notificaciones
                        </b>
                        .
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(3)</span>
                        Una vez nos registremos en una actividad, nos aparecerá
                        esta sección, la cual tiene los datos de la actividad y
                        el
                        <b className="ms-1">estado de nuestra solicitud</b>.
                        (también la posibilidad de darse de baja en caso de
                        desearlo).
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(4)</span>
                        Podrás <b className="ms-1">VOLVER</b> a la sección de
                        <b className="ms-1">ACTIVIDADES</b> presionando el logo
                        del natatorio.
                      </li>
                    </ul>
                  </div>
                  <div className={`w-100 ${style.imagen__container}`}>
                    <img
                      src={Imagen_2}
                      alt="imagen_1"
                      className="w-100 h-100"
                    />
                  </div>
                </>
              )}
              {pagina === 4 && (
                <>
                  <h3>Usuario - Información</h3>
                  <div className="mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <span className="text-danger me-1">(1)</span> En esta
                        sección veremos todos los
                        <b className="ms-1 me-1">datos del usuario</b>, los
                        cuales podrán ser
                        <b className="ms-1 me-1">editados</b>
                        en caso de ser necesario.
                      </li>
                    </ul>
                  </div>
                  <div className={`w-100 ${style.imagen__container}`}>
                    <img
                      src={Imagen_3}
                      alt="imagen_1"
                      className="w-100 h-100"
                    />
                  </div>
                </>
              )}
              {pagina === 5 && (
                <>
                  <h3>Usuario - Notificaciones</h3>
                  <div className="mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <span className="text-danger me-1">(1)</span> En esta
                        sección veremos las
                        <b className="ms-1 me-1">notificaciones</b>. Se nos irá
                        informando en las mismas nuestro
                        <b className="ms-1 me-1">estado de actividad</b>, ya sea
                        por alta o baja de la misma.
                      </li>
                    </ul>
                  </div>
                  <div className={`w-100 ${style.imagen__container}`}>
                    <img
                      src={Imagen_4}
                      alt="imagen_1"
                      className="w-100 h-100"
                    />
                  </div>
                </>
              )}
              {pagina === 6 && (
                <>
                  <h3>Actividades</h3>
                  <div className="mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <span className="text-danger me-1">(1)</span> Para poder
                        inscribirte en una actividad, primero deberás cargar los
                        archivos que se muestran en la página de inicio.
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(2)</span> Una vez
                        cargados los archivos, podrás seleccionar la actividad
                        que desees (siempre y cuando la misma tenga cupos).
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(3)</span> Cuando
                        hayas finalizado la inscripción, en la página de usuario
                        sección actividades, podrás ver el estado de la misma.
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger me-1">(4)</span> Una vez
                        que administración verifique que todos tus archivos
                        están en orden, se te dará de alta y se actualizará la
                        actividad, y te llegará una notificación.
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-center">
              {pagina !== 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClickPrevious}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Anterior
                </button>
              )}
              {pagina !== 6 ? (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleClickNext}
                >
                  Siguiente
                  <i className="bi bi-arrow-right me-1"></i>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { ModalHelpUser };
