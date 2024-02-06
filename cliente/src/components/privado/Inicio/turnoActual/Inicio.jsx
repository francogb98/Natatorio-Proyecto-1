import { useQuery, useMutation } from "react-query";
import style from "./inicio.module.css";

import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate.js";

import { cambioDeTurno } from "../../../../helpers/piletas/cambioDeTurno.js";

import Layout from "./tablaUsuariosTurnoActual/Layout.jsx";

import swal from "sweetalert2";

function Inicio() {
  const usuarios = useQuery("getUsrsByDate", getActivitiesByDate);

  const cambiarTurno = useMutation(cambioDeTurno, {
    onSuccess: (data) => {
      if (data.ok === true) {
        swal.fire({
          title: "Turno cambiado",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  if (usuarios.isLoading)
    return (
      <div className="alert alert-secondary text-center">
        <h3>Cargando Usuarios turno actual por favor espere...</h3>
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXloaXYzamtheW4yZ3Q0a2FwMG16aGw2ZGZxZWNmOWNzanE4M2lsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WFEpbNDqjs312EZ06H/giphy.gif"
          alt="Dog Swimming Sticker by Rede Genoma"
          style={{ width: "30%" }}
        ></img>
      </div>
    );

  return (
    <>
      <section className={style.body}>
        <main className={style.main}>
          {cambiarTurno.isLoading ? (
            <h3 className="alert alert-secondary">
              Cambiando turno por favor espere...
            </h3>
          ) : (
            <>
              <button
                className="btn btn-lg btn-warning mb-3 mt-2"
                style={{
                  paddingTop: "15px",
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <h3>Cambiar Turno</h3>
              </button>
              <h2>Registrar turno actual</h2>

              <Layout usuarios={usuarios} />
            </>
          )}
        </main>
      </section>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Desea realizar el cambio de turno
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => {
                  cambiarTurno.mutate();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inicio;
