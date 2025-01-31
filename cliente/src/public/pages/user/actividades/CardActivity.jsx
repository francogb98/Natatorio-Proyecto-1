import { useMutation } from "react-query";
import { capitalizeFirstLetter } from "../../../utils/MayusculaPL";
import PropTypes from "prop-types";
import { UserFetch } from "../../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

function CardActivity({ status, activity, i }) {
  const { userRefetch } = useContext(AuthContext);

  const darDeBaja = useMutation({
    mutationFn: UserFetch.darDeBajaActividad,
    onSuccess: (data) => {
      toast.success(data.message);
      userRefetch();
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
        <button className="btn btn-danger" onClick={() => handleBaja()}>
          Dar de baja
        </button>
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
