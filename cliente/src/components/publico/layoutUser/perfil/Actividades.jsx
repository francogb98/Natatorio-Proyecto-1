import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { darDeBajaActividad } from "../../../../helpers/usersFetch/darDeBajaActividad";

import style from "./style.module.css";

import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext";

function Actividades() {
  const { auth, userRefetch } = useContext(AuthContext);

  const [darDeBajaStatus, setDarDeBajaStatus] = useState(false);

  const darDeBaja = useMutation({
    mutationFn: darDeBajaActividad,
    onSuccess: (data) => {
      Swal.fire({
        title: data.status.toUpperCase(),
        text: data.message,
        icon: data.status,
        confirmButtonText: "Aceptar",
      });

      userRefetch();
    },
    onError: (error) => {
      Swal.fire({
        title: error.status.toUpperCase(),
        text: error.message,
        icon: error.status,
        confirmButtonText: "Aceptar",
      });
    },
  });

  return (
    <div>
      {!auth.user.status && auth.user.activity?.length > 0 ? (
        <div className={style.body__activity}>
          <div className={style.info}>
            <label htmlFor="">Actividad:</label>

            <p>{auth.user.activity[0].name}</p>
            {/* icono de X para dar de baja */}
          </div>
          <div className={style.info}>
            <label htmlFor="">Dias:</label>
            <p>{auth.user.activity[0].date?.join(" - ")}</p>
          </div>
          <div className={style.info}>
            <label htmlFor="">Horario:</label>
            <p>
              {auth.user.activity[0].hourStart} -{" "}
              {auth.user.activity[0].hourFinish}
            </p>
          </div>
          <div className={style.info}>
            <label htmlFor="">Estado:</label>
            <p className="fw-bold">Esperando confirmacion</p>
          </div>
          {!darDeBajaStatus ? (
            <button
              className={style.button__editar}
              style={{ width: "100%" }}
              onClick={() => setDarDeBajaStatus(!darDeBajaStatus)}
            >
              Dar de baja
            </button>
          ) : (
            <>
              {darDeBaja.isLoading && (
                <h6 style={{ textAlign: "center" }}>Dando de baja...</h6>
              )}

              {!darDeBaja.isLoading &&
                !darDeBaja.isSuccess &&
                !darDeBaja.isError && (
                  <h6 style={{ textAlign: "center" }}>
                    ¿Seguro que desea dar de baja esta actividad?
                  </h6>
                )}

              <div className={style.buttons}>
                <button
                  className={style.button__cancel}
                  onClick={() => {
                    setDarDeBajaStatus(!darDeBajaStatus);
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
                <button
                  className={style.button__confirm}
                  onClick={() => {
                    darDeBaja.mutate(auth.user.activity[0]._id);
                    setDarDeBajaStatus(!darDeBajaStatus);
                  }}
                >
                  <i className="bi bi-check-lg"></i>
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
      {auth.user.status && auth.user.activity?.length > 0 ? (
        <>
          <div className={style.body__activity}>
            <div className={style.info}>
              <label htmlFor="">Actividad:</label>

              <p>{auth.user.activity[0].name}</p>
              {/* icono de X para dar de baja */}
            </div>
            <div className={style.info}>
              <label htmlFor="">Dias:</label>
              <p>{auth.user.activity[0].date?.join(" - ")}</p>
            </div>
            <div className={style.info}>
              <label htmlFor="">Horario:</label>
              <p>
                {auth.user.activity[0].hourStart} -{" "}
                {auth.user.activity[0].hourFinish}
              </p>
            </div>
            {!darDeBajaStatus ? (
              <button
                className={style.button__editar}
                style={{ width: "100%" }}
                onClick={() => setDarDeBajaStatus(!darDeBajaStatus)}
              >
                Dar de baja
              </button>
            ) : (
              <>
                {darDeBaja.isLoading && (
                  <h6 style={{ textAlign: "center" }}>Dando de baja...</h6>
                )}

                {!darDeBaja.isLoading &&
                  !darDeBaja.isSuccess &&
                  !darDeBaja.isError && (
                    <h6 style={{ textAlign: "center" }}>
                      ¿Seguro que desea dar de baja esta actividad?
                    </h6>
                  )}

                <div className={style.buttons}>
                  <button
                    className={style.button__cancel}
                    onClick={() => {
                      setDarDeBajaStatus(!darDeBajaStatus);
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                  <button
                    className={style.button__confirm}
                    onClick={() => {
                      darDeBaja.mutate(auth.user.activity[0]._id);
                      setDarDeBajaStatus(!darDeBajaStatus);
                    }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
      {auth.user.status && auth.user.activity?.length === 0 ? (
        <div className={style.info}>
          <label htmlFor="">Actividad:</label>
          <p>No tienes actividad</p>
        </div>
      ) : null}
    </div>
  );
}

export default Actividades;
