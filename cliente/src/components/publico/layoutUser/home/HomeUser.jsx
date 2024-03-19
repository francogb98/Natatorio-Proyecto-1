import { useContext, useEffect, useState } from "react";
import style from "./homeUser.module.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

function HomeUser() {
  const { auth } = useContext(AuthContext);
  const [fechaCargaCertificadoHongos, setFechaCargaCertificadoHongos] =
    useState(false);

  useEffect(() => {
    var fecha = new Date(auth.user.fechaCargaCertificadoHongos);
    // Añadir un mes a la fecha proporcionada
    fecha.setMonth(fecha.getMonth() + 1);
    // Obtener la fecha actual
    var fechaActual = new Date();
    // Comparar las fechas
    if (fecha <= fechaActual) {
      setFechaCargaCertificadoHongos(true);
    }
  }, []);

  console.log(auth.user);

  return (
    <div className={style.body}>
      <h1 className="text-danger">
        Pasos a seguir para la inscripcion en actividades
      </h1>

      <section
        style={{
          border: `1px solid ${fechaCargaCertificadoHongos ? "red" : "green"}`,
          padding: "8px",
        }}
      >
        {/* {auth.user.status && (
          <div
            className="d-flex fs-3 fw-bold"
            style={{
              justifyContent: "space-between",
            }}
          >
            <p>Inasitencias: </p>
            <p className="text-danger fw-bold">
              {auth.user.inasistencias.length}
            </p>
          </div>
        )} */}

        <div
          className="d-flex fs-3"
          style={{
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              width: "65%",
            }}
          >
            Fecha de carga certificado Pediculos y Micosis:{" "}
          </p>
          <p
            className={`${
              fechaCargaCertificadoHongos ? "text-danger" : "text-success"
            } fw-bold`}
          >
            {auth.user.fechaCargaCertificadoHongos}
          </p>
        </div>
        {fechaCargaCertificadoHongos && (
          <>
            <div className={`text-danger`}>
              Debes Actualizar tu certificado para continuar con tu actividad.
              <br />
              Pasado el lapso de dos semanas se te dara de baja de la actividad
            </div>
          </>
        )}
      </section>

      <section
        className={style.seccion1}
        style={
          auth.user.foto &&
          auth.user.fichaMedica &&
          auth.user.certificadoHongos &&
          auth.user.fotoDocumento
            ? {
                border: "2px solid green",
              }
            : {
                border: "2px solid red",
              }
        }
      >
        <h2 className="fw-bold">Carga Tus Archivos</h2>
        <article className={style.seccion1_article}>
          <div>
            <h4>Estado de tus archivos</h4>
            <p>
              Foto de perfil:{" "}
              <span
                className={
                  auth.user.foto
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {auth.user.foto ? "Cargado" : "Pendiente"}
              </span>
            </p>
            <p>
              Foto de DNI:{" "}
              <span
                className={
                  auth.user.fotoDocumento
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {auth.user.fotoDocumento ? "Cargado" : "Pendiente"}
              </span>
            </p>
            <p>
              Certificado Pediculosis y Micosis:{" "}
              <span
                className={
                  auth.user.certificadoHongos
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {auth.user.certificadoHongos ? "Cargado" : "Pendiente"}
              </span>
            </p>
            <p>
              Ficha Medica:{" "}
              <span
                className={
                  auth.user.fichaMedica
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {auth.user.fichaMedica ? "Cargado" : "Pendiente"}
              </span>
            </p>
          </div>
          <div className="text-center">
            <h3 className="fw-bold">
              Carga tus archivos haciendo{" "}
              <Link to={"/user/perfil"} className="fw-bold">
                Click Aqui
              </Link>
            </h3>
            <small>(O dirigete a la seccion de perfil)</small>
          </div>
        </article>
      </section>

      <section
        className={style.seccion2}
        style={
          auth.user.foto &&
          auth.user.fichaMedica &&
          auth.user.certificadoHongos &&
          auth.user.fotoDocumento
            ? auth.user.activity?.length
              ? {
                  border: "2px solid green",
                }
              : {
                  border: "2px solid orange",
                }
            : {
                border: "2px solid red",
              }
        }
      >
        {auth.user.foto &&
        auth.user.fichaMedica &&
        auth.user.certificadoHongos &&
        auth.user.fotoDocumento ? (
          <>
            <h2 className="fw-bold"> Inscripcion en Actividades</h2>

            <article className={style.seccion2_article}>
              {auth.user.activity?.length ? (
                <div>
                  {!auth.user.status ? (
                    <div>
                      <h5>
                        <b>Te has registrado con exito</b> en tu actividad en
                        las siguientes 24/48 horas estaremos evaluando tu perfil
                        y actualizando tu estado.
                      </h5>
                      <h4>
                        Estado de tu inscripcion:{" "}
                        <span className="text-danger">Pendiente</span>
                      </h4>
                    </div>
                  ) : (
                    <div>
                      <h5>
                        ¡Felicidades! Tu inscripcion fue aprobada. <br />{" "}
                        <b>Recuerda</b>
                        que deberas ir con tu <b>numero de usuario</b> para que
                        te registren la asistencia y no perder tu cupo.
                      </h5>

                      <h4>
                        Estado de tu inscripcion:{" "}
                        <span className="text-success">Aprobada</span>
                      </h4>
                    </div>
                  )}
                </div>
              ) : (
                <h3>
                  Dirigete a la seccion{" "}
                  <Link to={"/user/inscripcion"} className="fw-bold">
                    Actividades
                  </Link>{" "}
                  para inscribirte en alguna
                </h3>
              )}
            </article>
          </>
        ) : (
          <h3>Por favor cargue sus archivos para pasar a esta seccion</h3>
        )}
      </section>
    </div>
  );
}

export default HomeUser;
