import { useContext, useState } from "react";
// import { useMutation } from "react-query";

import Tabla from "../../../../utilidades/Tabla";
// import { registrarUsuarioEnActividad } from "../../../../helpers/usersFetch/registrarUsuarioEnActividad";
// import Swal from "sweetalert2";

import style from "./styles.module.css";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

function PruebaInscripciones() {
  const [actividadRegistrarse, setActividadRegistrarse] = useState(null);

  const { auth, registerInActivity } = useContext(AuthContext);

  // const navigate = useNavigate();

  const handleSubmit = (id) => {
    registerInActivity.mutate({
      idActividad: id,
    });

    setActividadRegistrarse(null);
  };

  const columns = [
    {
      header: "Horario",
      accessorKey: "horario",
      accessorFn: (row) => {
        return `${row.hourStart} - ${row.hourFinish}`;
      },
    },
    {
      header: "Actividad",
      accessorKey: "name",
      accessorFn: (row) => {
        return `${
          row.natacionAdaptada ? row.name + " (natacion adaptada)" : row.name
        } `;
      },
    },
    {
      header: "Dias",
      accessorKey: "dias",
      cell: ({ row }) => {
        return (
          <div
            style={{
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            {row.original.date.join(" - ")}
          </div>
        );
      },
    },
    //accion para inscribirse
    {
      header: "Inscribirse",
      accessorKey: "inscribirse",
      cell: ({ row }) => {
        if (row.original.cupos === 0) {
          return <div className="text-danger fw-bold text-center">Agotado</div>;
        } else {
          return (
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => {
                setActividadRegistrarse(row.original);
              }}
            >
              Inscribirse
            </button>
          );
        }
      },
    },
  ];

  return (
    <div>
      {registerInActivity.isLoading && (
        <div
          className="alert alert-danger"
          style={{
            position: "fixed",
            top: "0",
            width: "100%",
          }}
        >
          Registrando...
        </div>
      )}

      <div
        className={`accordion accordion-flush ${style.acordion}`}
        id="accordionFlushExample"
      >
        <div className="accordion-item ">
          <h2 className="accordion-header bg-warning">
            <button
              className="accordion-button collapsed bg-warning "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              <i
                className="bi bi-exclamation-triangle-fill"
                style={{
                  fontSize: "1.5rem",
                  marginRight: "1rem",
                }}
              ></i>
              Cosas a tener en cuenta
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body text-start">
              <ul>
                <li className="mb-2">
                  Solo se mostraran las actividades disponibles para su
                  <strong> edad.</strong>
                </li>
                {/* <li className="mb-2">
                  Solo se mostraran las actividades que tengan
                  <strong> cupos disponibles.</strong>
                </li> */}
                <li className="mb-2">
                  Las actividades estan ordenadas por{" "}
                  <strong>HORARIO no por NOMBRE.</strong>{" "}
                </li>

                <li className="mb-2">
                  En la columna{" "}
                  <span className="text-danger fw-bold">Horario</span> se
                  muestra el horario de la actividad. (ingreso - salida)
                </li>
                <li className="mb-2">
                  En la columna{" "}
                  <span className="text-danger fw-bold">Actividad</span> se
                  mostrara el nombre de la misma
                </li>
                <li className="mb-2">
                  En la columna{" "}
                  <span className="text-danger fw-bold">Dias</span> se muestra
                  los dias que se dicta la actividad.
                </li>

                <li className="mb-2">
                  En la<strong> barra de busqueda </strong>puede buscar por
                  horario o actividades . (ej:10 ----{">"} aparecera todas las
                  actividades que comiencen a las 10 o finalicen en dicho
                  horario; Misma logica para nombre de actividades)
                </li>

                <br />
                <b>Datos sobre las actividades:</b>
                <li className="mb-2 mt-2">
                  <strong> Escuela de natacion para adultos: </strong>Clases de
                  natación guiadas por profesionales desde 0 o para continuar
                  con el aprendizaje de otros estilos: crol, espalda, pecho,
                  mariposa
                </li>
                <li className="mb-2">
                  <strong> PILETA LIBRE: </strong>Para usuarios que ya sepan
                  nadar uno o más estilos sin la instrucción de un profesional
                  en pileta de 25 o 50mts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={style.tabla}>
        <Tabla
          columns={columns}
          data={auth.actividadesUsuario}
          type={"Actividad"}
        />
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
                  handleSubmit(actividadRegistrarse?._id);
                }}
                data-bs-dismiss="modal"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PruebaInscripciones;
