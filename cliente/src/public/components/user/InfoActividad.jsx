import { capitalizeFirstLetter } from "../../utils/MayusculaPL";

function InfoActividad({ status, activity, i }) {
  const colors = ["primary", "danger"];

  return (
    <div className={`card border-${colors[i]}`}>
      <h5 className="card-header">Infromacion de Actividad</h5>
      <div className="card-body">
        <h5 className="card-title">
          Nombre:{" "}
          <span className={`text-${colors[i]}`}>
            {" "}
            {capitalizeFirstLetter(activity.name)}
          </span>
        </h5>
        <p className="card-text fw-bold">
          Estado de Solicitud:{" "}
          <span
            className={`fw-bold ${status ? "text-success" : "text-warning"}`}
          >
            {status ? "Aprobado" : "Pendiente"}
          </span>
        </p>
        <p className="card-text">
          Horario:{" "}
          <span className="fw-bold">
            {activity.hourStart} - {activity.hourFinish}
          </span>
        </p>
        <p className="card-text">
          Dias: <span className="fw-bold">{activity.date.join(", ")}</span>
        </p>
        <p className="card-text">
          Pileta:{" "}
          <span className="fw-bold">
            {capitalizeFirstLetter(activity.pileta)}
          </span>
        </p>
        <button className="btn btn-danger">Dar de baja</button>
      </div>
    </div>
  );
}

export default InfoActividad;
