import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";

import PropTypes from "prop-types";
import { capitalizeFirstLetter } from "../../utils/MayusculaPL";

import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import Spinner from "../../utils/Spinner";
import style from "./style.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CardActividad({ actividad }) {
  const { auth } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const registerInActivity = useMutation({
    mutationFn: UserFetch.registrarUsuarioEnActividad,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Usuario inscripto con exito!",
          showConfirmButton: false,
          timer: 1500,
        });
        queryClient.invalidateQueries(["user"]);
      }
      if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Error de inscripcion",
          text: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
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
      Swal.fire({
        icon: "error",
        title: "Falta cargar archivos.",
        text: "Por favor cargar los archivos necesarios para poder inscribirse.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (auth.user.edad > actividad.hasta) {
      alert("La actividad no corresponde a la edad del usuario");

      return;
    }
    if (auth.user.edad < actividad.desde) {
      alert("La actividad no corresponde a la edad del usuario");

      return;
    }
    registerInActivity.mutate({
      idActividad: actividad._id,
      userId: auth.user._id,
    });
  };
  return (
    <div className={`card shadow ${style.card}`}>
      <div className="card-header bg-primary text-white">
        <h6 className="mb-0">{capitalizeFirstLetter(actividad.name)}</h6>
      </div>
      <div className={`card-body ${style.card__list}`}>
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
            <strong>Edades permitidas:</strong> {actividad.desde} -{" "}
            {actividad.hasta}
          </li>

          <li className="list-group-item">
            <strong>Natación adaptada:</strong>{" "}
            {actividad.natacionAdaptada ? "Sí" : "No"}
          </li>
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
              } w-75 d-block mx-auto`}
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
            } w-75 d-block mx-auto`}
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
    codigoDeAcceso: PropTypes.string,
    _id: PropTypes.string.isRequired,
    natacionAdaptada: PropTypes.bool.isRequired,
    date: PropTypes.arrayOf(PropTypes.string).isRequired,
    cupos: PropTypes.number.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export { CardActividad };
