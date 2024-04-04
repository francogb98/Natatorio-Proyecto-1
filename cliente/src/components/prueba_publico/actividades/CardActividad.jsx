import inscripcion from "../funciones_usuario/inscripcion";

function CardActividad({
  actividad,
  actividadRegistrarse,
  setActividadRegistrarse,
}) {
  const { registerInActivity } = inscripcion();

  return (
    <>
      <div
        class={`card mb-3 ${
          actividad.users.length < actividad.cupos
            ? "border border-success"
            : "border border-danger"
        }`}
        style={{ width: "18rem" }}
      >
        <div class="card-body">
          <h5 class="card-title fw-bold text-center">
            {actividad.name.charAt(0).toUpperCase() + actividad.name.slice(1)}
          </h5>

          <h6 class={`card-subtitle text-center mb-2`}>
            {actividad.natacionAdaptada && <small>( Natacion Adaptada )</small>}
          </h6>
          <h6
            class={`card-subtitle text-center border-bottom pb-1 ${
              actividad.users.length < actividad.cupos
                ? "text-success"
                : "text-danger"
            }`}
          >
            {actividad.users.length < actividad.cupos
              ? "Disponible"
              : "Agotado"}
          </h6>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p className="card-text pt-2">
              Dias:{" "}
              <span className="fw-bold">{actividad.date.join(" - ")}</span>
            </p>
            <p className="card-text">
              Horario:{" "}
              <span className="fw-bold">
                {actividad.hourStart} - {actividad.hourFinish}
              </span>
            </p>
            <p className="card-text">
              Edad:{" "}
              <span className="fw-bold">
                {actividad.desde < 3 ? "3" : actividad.desde} -{" "}
                {actividad.hasta > 20 ? "en adelante" : actividad.hasta}
              </span>
            </p>
            {actividad.users.length < actividad.cupos && (
              <button
                className="btn btn-primary d-block"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setActividadRegistrarse(actividad);
                }}
              >
                Inscribirse
              </button>
            )}
          </div>
        </div>
      </div>

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
                ¿Seguro que deseas inscribirte a la siguiente actividad?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setActividadRegistrarse(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              Nombre: {actividadRegistrarse?.name}
              <br />
              Dias: {actividadRegistrarse?.date.join(" - ")}
              <br />
              Hora de inicio: {actividadRegistrarse?.hourStart}
              <br />
              Hora de salida: {actividadRegistrarse?.hourFinish}
              <br />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setActividadRegistrarse(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  registerInActivity.mutate({
                    idActividad: actividadRegistrarse?._id,
                  });
                }}
                data-bs-dismiss="modal"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardActividad;
