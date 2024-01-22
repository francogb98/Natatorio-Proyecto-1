import { useState } from "react";

import style from "./styles.module.css";

import { getInfoUser } from "../../../../helpers/fetch";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";

import { getActividadesNombre } from "../../../../helpers/activitiesFetch/getActividadesNombre";
import PruebaInscripciones from "./PruebaInscripciones";

function Inscripcion() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const colors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ];

  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        return data;
      }
    },
  });
  const getActivity = useQuery({
    queryKey: ["activitys"],
    queryFn: getActividadesNombre,
  });

  if (!getUser.data) {
    return (
      <>
        <h1>Usuario no encontrado </h1>
        <button
          onClick={() => {
            getUser.refetch();
          }}
          className="btn btn-primary"
        >
          Recargar
        </button>
      </>
    );
  }

  if (getActivity.isError) {
    return (
      <div className={style.container}>
        <h1>ERROR</h1>
      </div>
    );
  }

  if (getActivity.isLoading || !getActivity.data) {
    return (
      <div className={style.container}>
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (getActivity.isSuccess && getActivity.data) {
    // quiero que getHours.data.data.hours se ordene de menor a mayor
    //necesito traer todos los nombre de actividades y guardarlos en un estadom, sin que se reptina
    return (
      <div className={style.container}>
        {!actividadSeleccionada ? (
          <>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Inscripciones /
                </li>
              </ol>
            </nav>
            <h1 className={style.title}>Inscripciones</h1>

            <div className="alert alert-info">
              Si ya estas inscripto en una actividad y deseas cambiarla, ve a la
              seccion de <Link to={"editarPerfil"}>Perfil</Link> y da de baja la
              actividad en la que estas inscripto.
            </div>
          </>
        ) : null}

        <div
          className={`${
            actividadSeleccionada ? style.noLook : style.buttonGroup
          }`}
        >
          {getUser.data.user.activity?.length ? (
            <div className="alert alert-info d-block mx-auto">
              <div>
                Ya estas inscripto en la actividad:{" "}
                <span className="text-success">
                  {getUser.data.user.activity[0].name}
                </span>
              </div>
              <div>
                Estado de su Solicitud:{" "}
                {getUser.data.user.status ? (
                  <span className="text-success">Aprobado</span>
                ) : (
                  <span className="text-danger">Esperando Aprobacion</span>
                )}
              </div>
            </div>
          ) : (
            <>
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
                        <li className="mb-2">
                          Solo se mostraran las actividades que tengan
                          <strong> cupos.</strong>
                        </li>
                        <p className="text-primary">
                          ( Las siguientes indicaciones sera para cuando usted
                          haya seleccionado una actividad )
                        </p>
                        <li className="mb-2">
                          En la columna{" "}
                          <span className="text-danger fw-bold">Horario</span>{" "}
                          se muestra el horario de la actividad. (ingreso -
                          salida)
                        </li>
                        <li className="mb-2">
                          En la columna{" "}
                          <span className="text-danger fw-bold">Dias</span> se
                          muestra los dias que se dicta la actividad.
                        </li>

                        <li className="mb-2">
                          En la<strong> barra de busqueda </strong>puede buscar
                          por horario o dias. (ej:10 ----{">"} aparecera todas
                          las actividades que comiencen a las 10 o finalicen en
                          dicho horario; Misma logica para los dias)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <h4>Elige tu actividad:</h4>
              {getActivity.data.map((activity, i) => (
                <button
                  key={i}
                  className={`btn btn-${colors[i]}`}
                  onClick={() => setActividadSeleccionada(activity)}
                >
                  {activity}
                </button>
              ))}
            </>
          )}
        </div>
        {actividadSeleccionada && (
          <div
            className={`${
              actividadSeleccionada ? style.tablaActividades : style.noLook
            }`}
          >
            <PruebaInscripciones
              actividad={actividadSeleccionada}
              setActividadSeleccionada={setActividadSeleccionada}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Inscripcion;
