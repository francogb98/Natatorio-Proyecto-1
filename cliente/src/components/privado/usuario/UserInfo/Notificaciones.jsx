import React, { useEffect } from "react";

import style from "./style.module.css";

import { useMutation, useQueryClient } from "react-query";

import { deleteNotificacion } from "../../../../helpers/usersFetch/notificaciones/deleteNotificacion";

function Notificaciones({ user }) {
  const queryClient = useQueryClient();

  const [success, setSuccess] = React.useState(false);

  const mutation = useMutation(deleteNotificacion, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("usuarios");
    },
  });

  const handleDelete = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [mutation.isSuccess]);

  return (
    <div className="card-body">
      <h5 className="card-title">Notificaciones</h5>
      {mutation.isLoading && (
        <div className="alert alert-info" role="alert">
          Eliminando notificacion...
        </div>
      )}
      {mutation.isError && (
        <div className="alert alert-danger" role="alert">
          Error al eliminar notificacion
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          Notificacion eliminada
        </div>
      )}
      {
        //si el usuario no tiene notificaciones
        !user.notificaciones || user.notificaciones.length === 0 ? (
          <p className="card-text">No hay notificaciones</p>
        ) : (
          //si el usuario tiene notificaciones
          <ul className={style.list}>
            {user.notificaciones
              ?.slice()
              .reverse()
              .map((notificacion, i) => {
                return (
                  <li className={style.listItem} key={notificacion._id}>
                    <div>
                      <a
                        data-bs-toggle="collapse"
                        href={`#collapseExample${i}`}
                        role="button"
                        aria-expanded="false"
                        aria-controls={`collapseExample${i}`}
                      >
                        {notificacion.asunto}
                      </a>

                      <div className="collapse" id={`collapseExample${i}`}>
                        <div className="card card-body">
                          {notificacion.cuerpo}

                          <p className="card-text">
                            {notificacion.leido ? (
                              <span className="text-success">Leido</span>
                            ) : (
                              <span className="text-danger">No leido</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDelete({
                          idNotificacion: notificacion._id,
                          idUsuario: user._id,
                        })
                      }
                    >
                      x
                    </button>
                  </li>
                );
              })}
          </ul>
        )
      }
    </div>
  );
}

export default Notificaciones;
