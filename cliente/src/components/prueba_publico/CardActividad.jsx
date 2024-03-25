import style from "./style_actividad.module.css";

function CardActividad({ actividad }) {
  return (
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
          {actividad.users.length < actividad.cupos ? "Disponible" : "Agotado"}
        </h6>
        <p className="card-text pt-2">
          Dias: <span className="fw-bold">{actividad.date.join(" - ")}</span>
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
      </div>
    </div>
  );
}

export default CardActividad;
