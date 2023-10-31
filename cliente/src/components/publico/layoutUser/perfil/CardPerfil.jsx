import React from "react";

function CardPerfil({ user }) {
  return (
    <div className={`card `} style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">Estado de archivos</h5>
        <h6
          className={
            user.fichaMedica && user.certificadoHongos
              ? "card-subtitle mb-2 text-success"
              : "card-subtitle mb-2 text-danger"
          }
        >
          {user.fichaMedica && user.certificadoHongos
            ? "Archivos cargados correctamente"
            : "Dirijase a la seccion de carga de archivos para subir los archivosfaltantes"}
        </h6>
        {user.natacionAdaptada ? (
          <p className="card-text">
            CUD:{" "}
            <span className={user.cud ? "text-success" : "text-danger"}>
              {user.cud ? "Cargado" : "No cargado"}
            </span>
          </p>
        ) : null}

        <p className="card-text">
          Certificado Hongos:{" "}
          <span
            className={user.certificadoHongos ? "text-success" : "text-danger"}
          >
            {" "}
            {user.certificadoHongos
              ? user.fechaCargaCertificadoHongos
              : "No cargado"}
          </span>
        </p>

        <div className="card-text">
          <span>Ficha Medica:</span>{" "}
          {user.fichaMedica == undefined ? (
            <p className="text-danger">No has cargado tu ficha medica</p>
          ) : (
            <button
              onClick={() =>
                handleViewFicha({
                  img: user.fichaMedica,
                })
              }
            >
              Ver ficha
            </button>
          )}
        </div>

        <div className="card-text">
          <span>Actividades:</span>{" "}
          {user.activity == null ? (
            <p className="text-danger">
              No estas inscripto a ninguna actividad
            </p>
          ) : !user.status ? (
            <p
              className="alert alert-danger fw-bold"
              style={{ width: "fit-content" }}
            >
              Esperando confirmacion de inscripcion
            </p>
          ) : (
            <>
              <p>
                <span> Actividad:</span>
                {user.activity[0]?.name}
              </p>
              <p>
                <span>Horario Ingreso:</span>
                {user.activity[0]?.hourStart}
              </p>
              <p>
                <span>Horario Salida:</span>
                {user.activity[0]?.hourFinish}
              </p>
              <p>
                <span>Dias : </span>
                {user.activity[0]?.date.join(" - ")}
              </p>
            </>
          )}
        </div>

        <p className="card-text">
          Asistencia:{" "}
          <span
            className={
              user.asistencia[user.asistencia.length]
                ? "text-success"
                : "text-danger"
            }
          >
            {" "}
            {user.asistencia[user.asistencia.length]
              ? user.asistencia[user.asistencia.length]
              : "No se registran asistencias"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CardPerfil;
