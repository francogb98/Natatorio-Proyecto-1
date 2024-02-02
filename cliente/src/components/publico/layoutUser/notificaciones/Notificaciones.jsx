import { useContext } from "react";

import style from "./style.module.css";

import { useMutation } from "react-query";

import { updateNotificacion } from "../../../../helpers/usersFetch/notificaciones/updateNotificacion";
import { AuthContext } from "../../../../context/AuthContext";

function Notificaciones() {
  const { auth, userRefetch } = useContext(AuthContext);

  const mutation = useMutation(updateNotificacion, {
    onSuccess: () => {
      userRefetch();
    },
  });

  console.log(auth.user);

  return (
    <div className={style.body}>
      {auth.user.notificaciones
        ?.slice() // Copia el array para evitar modificar el original
        .reverse() // Invierte el orden del array
        .slice(0, 5) // Limita el array a 5 elementos
        .map((notificacion) => (
          <div className={style.notificacionBody} key={notificacion._id}>
            <div className={style.notificacion}>
              <header>
                <a
                  data-bs-toggle="collapse"
                  href={`#collapseExample${notificacion._id}`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={`collapseExample${notificacion._id}`}
                  onClick={
                    notificacion.leido === false
                      ? () => {
                          mutation.mutate({
                            idNotificacion: notificacion._id,
                          });
                        }
                      : null
                  }
                >
                  {notificacion.asunto}
                </a>
              </header>
              <section
                className="collapse"
                id={`collapseExample${notificacion._id}`}
              >
                <div className="card card-body">{notificacion.cuerpo}</div>
              </section>
            </div>

            {notificacion.leido === false ? (
              <div className={style.circle}></div>
            ) : null}
          </div>
        ))}
      {!auth.user.notificaciones.length && (
        <div className={style.sinNotificaciones}>No hay notificaciones</div>
      )}
    </div>
  );
}

export default Notificaciones;
