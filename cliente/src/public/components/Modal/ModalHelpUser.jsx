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

  const goToPage = (pageNumber) => {
    setPagina(pageNumber);
  };

  return (
    <>
      {isModalOpen && (
        <div
          className={`modal-backdrop fade show ${style.modalBackdrop}`}
        ></div>
      )}
      <div
        className={`modal fade ${isModalOpen ? "show" : ""} ${
          style.modalContainer
        }`}
        id="ModalHelp"
        tabIndex="-1"
        aria-labelledby="ModalHelpLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className={`modal-dialog ${style.modalDialog}`}>
          <div className={`modal-content ${style.modalContent}`}>
            <div className={`modal-header ${style.modalHeader}`}>
              <div className={style.logoContainer}>
                <img src={Logo} alt="Natatorio Logo" className={style.logo} />
                <h5 className={style.modalTitle}>Guía de Usuario</h5>
              </div>
              <button
                type="button"
                className={`btn-close ${style.closeButton}`}
                onClick={closeModal}
                aria-label="Close"
                data-testid="close-button"
              />
            </div>

            <div className={`modal-body ${style.modalBody}`}>
              {/* Progress Indicator */}
              <div className={style.progressContainer}>
                <div className={style.progressBar}>
                  {[1, 2, 3, 4, 5, 6].map((page) => (
                    <div
                      key={page}
                      className={`${style.progressStep} ${
                        pagina >= page ? style.active : ""
                      } ${pagina === page ? style.current : ""}`}
                      onClick={() => goToPage(page)}
                    >
                      <div className={style.stepNumber}>{page}</div>
                      {page < 6 && <div className={style.connector}></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              <div className={style.contentContainer}>
                {pagina === 1 && (
                  <div className={style.welcomeSection}>
                    <h2 className={style.welcomeTitle}>
                      Bienvenido al Natatorio Olímpico Madre de Ciudades
                    </h2>
                    <div className={style.welcomeContent}>
                      <p>
                        Nos complace darle la bienvenida a nuestra plataforma
                        oficial, donde podrá encontrar toda la información sobre
                        nuestras actividades, horarios y servicios.
                      </p>
                      <p>
                        Esta guía le explicará el funcionamiento de la página
                        para que pueda navegar de manera sencilla y aprovechar
                        al máximo su experiencia con nosotros.
                      </p>
                      <div className={style.tipBox}>
                        <i className={`bi bi-lightbulb ${style.tipIcon}`}></i>
                        <span>
                          Use los botones de navegación o haga clic en los
                          números arriba para moverse entre las secciones.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {pagina === 2 && (
                  <div className={style.contentSection}>
                    <h3 className={style.sectionTitle}>
                      <i
                        className={`bi bi-house-door ${style.sectionIcon}`}
                      ></i>
                      Página de Inicio
                    </h3>
                    <div className={style.featureList}>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>1</span>
                        <div className={style.featureText}>
                          <strong>Menú de usuario:</strong> Presionando este
                          icono podrás ingresar a las opciones del usuario.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>2</span>
                        <div className={style.featureText}>
                          <strong>Estado de archivos:</strong> En esta sección
                          podrás ver el estado de tus archivos y la fecha de
                          vencimiento del certificado de PyM.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>3</span>
                        <div className={style.featureText}>
                          <strong>Filtro de actividades:</strong> Aquí podrás
                          filtrar las actividades según su nombre, hora o día
                          (recuerda que solo se mostrarán las actividades
                          disponibles para tu edad).
                        </div>
                      </div>
                    </div>
                    <div className={style.imageContainer}>
                      <img
                        src={Imagen}
                        alt="Página de inicio"
                        className={style.helpImage}
                      />
                    </div>
                  </div>
                )}

                {pagina === 3 && (
                  <div className={style.contentSection}>
                    <h3 className={style.sectionTitle}>
                      <i className={`bi bi-person ${style.sectionIcon}`}></i>
                      Área de Usuario - Actividades
                    </h3>
                    <div className={style.featureList}>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>1</span>
                        <div className={style.featureText}>
                          <strong>Datos principales:</strong> Verás los datos
                          del usuario y el <strong>número para ingresar</strong>{" "}
                          al natatorio.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>2</span>
                        <div className={style.featureText}>
                          <strong>Navegación:</strong> Barra para acceder a{" "}
                          <strong>
                            Actividades, Datos de usuario y Notificaciones
                          </strong>
                          .
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>3</span>
                        <div className={style.featureText}>
                          <strong>Actividades registradas:</strong> Aparecerán
                          aquí con sus datos y el{" "}
                          <strong>estado de tu solicitud</strong>, además de la
                          opción para darte de baja.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>4</span>
                        <div className={style.featureText}>
                          <strong>Volver al inicio:</strong> Presionando el logo
                          del natatorio regresarás a la sección de{" "}
                          <strong>ACTIVIDADES</strong>.
                        </div>
                      </div>
                    </div>
                    <div className={style.imageContainer}>
                      <img
                        src={Imagen_2}
                        alt="Área de usuario"
                        className={style.helpImage}
                      />
                    </div>
                  </div>
                )}

                {pagina === 4 && (
                  <div className={style.contentSection}>
                    <h3 className={style.sectionTitle}>
                      <i
                        className={`bi bi-info-circle ${style.sectionIcon}`}
                      ></i>
                      Área de Usuario - Información
                    </h3>
                    <div className={style.featureList}>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>1</span>
                        <div className={style.featureText}>
                          <strong>Datos personales:</strong> En esta sección
                          verás todos tus <strong>datos personales</strong>, los
                          cuales podrás <strong>editar</strong> en caso de ser
                          necesario.
                        </div>
                      </div>
                    </div>
                    <div className={style.imageContainer}>
                      <img
                        src={Imagen_3}
                        alt="Información de usuario"
                        className={style.helpImage}
                      />
                    </div>
                  </div>
                )}

                {pagina === 5 && (
                  <div className={style.contentSection}>
                    <h3 className={style.sectionTitle}>
                      <i className={`bi bi-bell ${style.sectionIcon}`}></i>
                      Área de Usuario - Notificaciones
                    </h3>
                    <div className={style.featureList}>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>1</span>
                        <div className={style.featureText}>
                          <strong>Notificaciones:</strong> Aquí recibirás
                          información sobre el{" "}
                          <strong>estado de tus actividades</strong>, incluyendo
                          altas y bajas.
                        </div>
                      </div>
                    </div>
                    <div className={style.imageContainer}>
                      <img
                        src={Imagen_4}
                        alt="Notificaciones"
                        className={style.helpImage}
                      />
                    </div>
                  </div>
                )}

                {pagina === 6 && (
                  <div className={style.contentSection}>
                    <h3 className={style.sectionTitle}>
                      <i
                        className={`bi bi-calendar-check ${style.sectionIcon}`}
                      ></i>
                      Proceso de Inscripción
                    </h3>
                    <div className={style.featureList}>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>1</span>
                        <div className={style.featureText}>
                          <strong>Requisitos:</strong> Para inscribirte en una
                          actividad, primero deberás cargar los archivos
                          requeridos que se muestran en la página de inicio.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>2</span>
                        <div className={style.featureText}>
                          <strong>Selección:</strong> Una vez cargados los
                          archivos, podrás seleccionar la actividad que desees
                          (siempre que haya cupos disponibles).
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>3</span>
                        <div className={style.featureText}>
                          <strong>Seguimiento:</strong> En tu área de usuario,
                          sección actividades, podrás ver el estado de tu
                          solicitud.
                        </div>
                      </div>
                      <div className={style.featureItem}>
                        <span className={style.featureNumber}>4</span>
                        <div className={style.featureText}>
                          <strong>Confirmación:</strong> Cuando administración
                          verifique tus archivos, se te dará de alta y recibirás
                          una notificación.
                        </div>
                      </div>
                    </div>
                    <div className={style.completionMessage}>
                      <i
                        className={`bi bi-check-circle ${style.completionIcon}`}
                      ></i>
                      <p>
                        ¡Has completado la guía de usuario! Ahora estás listo
                        para usar nuestra plataforma.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`modal-footer ${style.modalFooter}`}>
              <div className={style.navigationButtons}>
                {pagina !== 1 && (
                  <button
                    type="button"
                    className={`btn ${style.navButton} ${style.prevButton}`}
                    onClick={handleClickPrevious}
                  >
                    <i className={`bi bi-arrow-left ${style.buttonIcon}`}></i>
                    Anterior
                  </button>
                )}

                {pagina !== 6 ? (
                  <button
                    type="button"
                    className={`btn ${style.navButton} ${style.nextButton}`}
                    onClick={handleClickNext}
                  >
                    Siguiente
                    <i className={`bi bi-arrow-right ${style.buttonIcon}`}></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn ${style.finishButton}`}
                    onClick={closeModal}
                  >
                    Comenzar
                    <i
                      className={`bi bi-box-arrow-in-right ${style.buttonIcon}`}
                    ></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { ModalHelpUser };
