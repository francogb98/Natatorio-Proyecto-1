import React from "react";

import style from "./homeUser.module.css";

function HomeUser({ user }) {
  return (
    <div className={style.body}>
      <h1>Pasos a seguir para la inscripcion en actividades</h1>
      <section className={style.section}>
        <div className={`${style.sectionItem}`}>
          <span className="bg-warning">1</span>

          <div className={style.infoSection}>
            <p>Carga de Archivos </p>
            <small>(Dirigete a la seccion perfil)</small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">2</span>{" "}
          <div className={style.infoSection}>
            <p>Inscripcion en Actividades </p>
            <small>
              (Una vez cargado todos los archivos, El icono de la seccion de
              actividades se vera asi:{" "}
              <i
                className="bi bi-calendar2-check"
                type="button"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></i>
              , eso querra decir que ya esta disponible la seccion para poder
              inscribirse en un actividad )
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">3</span>
          <div className={style.infoSection}>
            <p>Aprobacion de Inscripcion</p>
            <small>
              (Tendras una notificacion en cuanto veamos tu registro)
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">4</span>

          <div className={style.infoSection}>
            <p>¡A Disfrutar!</p>

            <small>
              (Una vez se te haya autorizado la inscripcion, podras asistir a
              las instalaciones del Natatorio Olimpico Madre de Ciudades,
              recuerda que deberas ir con tu numero de usuario para que te
              registren la asistencia)
            </small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeUser;
