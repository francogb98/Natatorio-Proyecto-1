import style from "./homeUser.module.css";
import { Link } from "react-router-dom";

function HomeUser({ user }) {
  return (
    <div className={style.body}>
      <h1>Pasos a seguir para la inscripcion en actividades</h1>
      <section className={style.section}>
        <div className={`${style.sectionItem}`}>
          {user.foto &&
          user.fichaMedica &&
          user.certificadoHongos &&
          user.fotoDocumento ? (
            <span className="bg-success">
              <i class="bi bi-check-lg"></i>
            </span>
          ) : (
            <span className="bg-warning">1</span>
          )}

          <div className={style.infoSection}>
            <p>Carga de Archivos </p>
            <small>
              (Dirigete a la seccion{" "}
              <Link to={"perfil"} className="fw-bold">
                PERFIL
              </Link>
              )
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          {user.activity?.length ? (
            <span className="bg-success">
              <i class="bi bi-check-lg"></i>
            </span>
          ) : (
            <span className="bg-warning">2</span>
          )}

          <div className={style.infoSection}>
            <p>Inscripcion en Actividades </p>
            <small>
              (Una vez cargado todos los archivos, podas acceder a la seccion de{" "}
              <Link to={"inscripcion"}>Actividades</Link>, y registrarte en la
              que desees )
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          {user.activity?.length && user.status ? (
            <span className="bg-success">
              <i class="bi bi-check-lg"></i>
            </span>
          ) : (
            <span className="bg-warning">3</span>
          )}

          <div className={style.infoSection}>
            <p>Aprobacion de Inscripcion</p>
            <small>
              (Tendras una notificacion en cuanto veamos tu registro)
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          {user.activity?.length && user.status ? (
            <span className="bg-success">
              <i class="bi bi-check-lg"></i>
            </span>
          ) : (
            <span className="bg-warning">4</span>
          )}

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
