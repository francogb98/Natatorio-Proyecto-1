import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";
import { useMutation } from "react-query";
import { toast } from "sonner";

import PropTypes from "prop-types";
import { capitalizeFirstLetter } from "../../utils/MayusculaPL";

import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import Spinner from "../../utils/Spinner";

function CardActividad({ actividad }) {
  const { auth } = useContext(AuthContext);

  const registerInActivity = useMutation({
    mutationFn: UserFetch.registrarUsuarioEnActividad,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario inscripto con exito!");
      }
      if (data.status === "error") {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = () => {
    //quiero comprobar que el usuario tenga los archivos cargados
    if (
      !auth.user.fichaMedica ||
      !auth.user.certificadoHongos ||
      !auth.user.fotoDocumento
    ) {
      alert(
        "Por favor cargar todos los ACHIVOS, verificar en el perfil el estado de sus archivos"
      );
      return;
    }
    registerInActivity.mutate({
      idActividad: actividad._id,
      userId: auth.user._id,
    });
  };
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">{capitalizeFirstLetter(actividad.name)}</h4>
      </div>
      <div className="card-body">
        <h5 className="card-title">Información de la Actividad</h5>
        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item">
            <strong>Pileta:</strong> {capitalizeFirstLetter(actividad.pileta)}
          </li>
          <li className="list-group-item">
            <strong>Horario:</strong> {actividad.hourStart} -{" "}
            {actividad.hourFinish}
          </li>
          <li className="list-group-item">
            <strong>Días:</strong> {actividad.date.join(", ")}
          </li>
          <li className="list-group-item">
            <strong>Cupos:</strong>{" "}
            {actividad.cupos > actividad.users.length ? (
              <span className="text-success">Disponible</span>
            ) : (
              <span className="text-danger">Agotado</span>
            )}
          </li>
          <li className="list-group-item">
            <strong>Edades permitidas:</strong> 4 - 70 años
          </li>

          <li className="list-group-item">
            <strong>Natación adaptada:</strong>{" "}
            {actividad.natacionAdaptada ? "Sí" : "No"}
          </li>
          {actividad.codigoDeAcceso && (
            <li className="list-group-item">
              <strong>Código de acceso:</strong>{" "}
              <b className="text-danger">{actividad.codigoDeAcceso} </b>
            </li>
          )}
        </ul>

        {auth.logged ? (
          registerInActivity.isLoading ? (
            //hace un spinner
            <Spinner />
          ) : (
            <button
              type="button"
              className={`btn ${
                actividad.cupos <= actividad.users.length
                  ? "btn-danger"
                  : "btn-success"
              } w-100`}
              onClick={() => handleSubmit()}
              disabled={actividad.cupos <= actividad.users.length}
            >
              {actividad.cupos <= actividad.users.length
                ? "Agotado"
                : "Inscribirse"}
            </button>
          )
        ) : (
          <button
            type="button"
            className={`btn ${
              actividad.cupos <= actividad.users.length
                ? "btn-danger"
                : "btn-success"
            } w-100`}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            disabled={actividad.cupos <= actividad.users.length}
          >
            {actividad.cupos <= actividad.users.length
              ? "Agotado"
              : "Inscribirse"}
          </button>
        )}
      </div>
    </div>
  );
}
CardActividad.propTypes = {
  actividad: PropTypes.shape({
    name: PropTypes.string.isRequired,
    pileta: PropTypes.string.isRequired,
    hourStart: PropTypes.string.isRequired,
    hourFinish: PropTypes.string.isRequired,
    codigoDeAcceso: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    natacionAdaptada: PropTypes.bool.isRequired,
    date: PropTypes.arrayOf(PropTypes.string).isRequired,
    cupos: PropTypes.number.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export { CardActividad };
