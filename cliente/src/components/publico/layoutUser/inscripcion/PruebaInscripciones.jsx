import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { getActivitysByName } from "../../../../helpers/activitiesFetch/getActivitysByName";

import Tabla from "../../../../utilidades/Tabla";
import { registrarUsuarioEnActividad } from "../../../../helpers/usersFetch/registrarUsuarioEnActividad";
import Swal from "sweetalert2";

import PropTypes from "prop-types";

function PruebaInscripciones({ actividad, setActividadSeleccionada }) {
  const [actividadRegistrarse, setActividadRegistrarse] = useState(null);

  const queryClient = useQueryClient();

  const getActividades = useMutation({
    mutationKey: "getActividades",
    mutationFn: getActivitysByName,
  });

  const registerInActivity = useMutation({
    mutationKey: "registerUser",
    mutationFn: registrarUsuarioEnActividad,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Inscripto con Exito",
          text: "Se ha inscripto correctamente en la actividad, redireccionando a pagina principal ",
          icon: data.status,
          //despues de 2 segundos lo redirecciones
          timer: 2000,
          confirmButtonText: "Aceptar",
        }).then(() => {
          //redirecciona al inicio
          window.location.href = "/user/home";
        });
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
      queryClient.invalidateQueries("getUser");
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

  const handleSubmit = (id) => {
    registerInActivity.mutate({
      idActividad: id,
    });

    setActividadRegistrarse(null);
  };

  useEffect(() => {
    getActividades.mutate({ activity: actividad });
  }, []);

  if (getActividades.isLoading) {
    return <h1>Cargando...</h1>;
  }
  if (getActividades.isError) {
    return <h1>ERROR</h1>;
  }
  if (getActividades.isSuccess) {
    const columns = [
      {
        header: "Horario",
        accessorKey: "horario",
        accessorFn: (row) => {
          return `${row.hourStart} - ${row.hourFinish}`;
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
        },
      },
    ];

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href="#"
                onClick={() => {
                  setActividadSeleccionada(null);
                }}
              >
                Inscripciones
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              tabla
            </li>
          </ol>
        </nav>

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
        <h1>Actividad: {actividad}</h1>
        <div className="accordion accordion-flush" id="accordionFlushExample">
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
                    <strong>
                      Solo se mostraran las actividades que tengan cupos.
                    </strong>
                  </li>
                  <li className="mb-2">
                    <strong>
                      Solo se mostraran las actividades disponibles para su
                      edad.
                    </strong>
                  </li>
                  <li className="mb-2">
                    <strong>
                      En la columna <span className="text-danger">Horario</span>{" "}
                      se muestra el horario de la actividad.
                    </strong>
                    (ingreso - salida)
                  </li>
                  <li className="mb-2">
                    <strong>
                      En la columna <span className="text-danger">Dias</span> se
                      muestra los dias que se dicta la actividad.
                    </strong>
                  </li>

                  <li className="mb-2">
                    <strong>
                      En la barra de busqueda puede buscar por horario o dias.
                    </strong>
                    (ej:10 ----{">"} aparecera todas las actividades que
                    comiencen a las 10 o finalicen en dicho horario; Misma
                    logica para los dias)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Tabla
          columns={columns}
          data={getActividades.data}
          type={"Actividad"}
        />

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
}

PruebaInscripciones.propTypes = {
  actividad: PropTypes.object.isRequired,
  setActividadSeleccionada: PropTypes.func.isRequired,
};

export default PruebaInscripciones;
