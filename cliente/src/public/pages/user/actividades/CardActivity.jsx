import { useMutation, useQueryClient } from "react-query";
import { capitalizeFirstLetter } from "../../../utils/MayusculaPL";
import PropTypes from "prop-types";
import { UserFetch } from "../../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

import { toast } from "sonner";

function CardActivity({ status, activity, i }) {
  const queryClient = useQueryClient();

  const darDeBaja = useMutation({
    mutationFn: UserFetch.darDeBajaActividad,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleBaja = () => {
    toast.info("Dando de baja actividad");
    darDeBaja.mutate(activity._id);
  };

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
        <button
          type="button"
          className="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#DarDeBajaModal
        "
        >
          Dar de baja
        </button>
      </div>

      <div
        className="modal fade"
        id="DarDeBajaModal"
        tabIndex="-1"
        aria-labelledby="DarDeBajaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="DarDeBajaModalLabel">
                Baja Actividad
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Estas seguro de dar de baja la actividad?
            </div>
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
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => handleBaja()}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CardActivity.propTypes = {
  status: PropTypes.bool.isRequired,
  activity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    hourStart: PropTypes.string.isRequired,
    hourFinish: PropTypes.string.isRequired,
    date: PropTypes.arrayOf(PropTypes.string).isRequired,
    pileta: PropTypes.string.isRequired,
  }).isRequired,
  i: PropTypes.number.isRequired,
};

export default CardActivity;
