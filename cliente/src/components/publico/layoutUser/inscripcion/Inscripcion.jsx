import style from "./styles.module.css";

import { getInfoUser } from "../../../../helpers/fetch";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";

import { getActividadesNombre } from "../../../../helpers/activitiesFetch/getActividadesNombre";
import PruebaInscripciones from "./PruebaInscripciones";

function Inscripcion() {
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
    return (
      <div className={style.container}>
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

        <div>
          {getUser.data.user.activity[0] ? (
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
            <PruebaInscripciones actividad={getActivity.data} />
          )}
        </div>
      </div>
    );
  }
}

export default Inscripcion;
