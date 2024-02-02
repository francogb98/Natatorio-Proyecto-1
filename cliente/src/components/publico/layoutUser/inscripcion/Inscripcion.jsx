import style from "./styles.module.css";

import { Link } from "react-router-dom";
import PruebaInscripciones from "./PruebaInscripciones";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

function Inscripcion() {
  const { auth } = useContext(AuthContext);

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
          seccion de <Link to={"/user/perfil/editarPerfil"}>Perfil</Link> y da
          de baja la actividad en la que estas inscripto.
        </div>
      </>

      <div>
        {auth.user.activity?.length ? (
          <div className="alert alert-info d-block mx-auto">
            <div>
              Ya estas inscripto en la actividad:{" "}
              <span className="text-success">{auth.user.activity[0].name}</span>
            </div>
            <div>
              Estado de su Solicitud:{" "}
              {auth.user.status ? (
                <span className="text-success">Aprobado</span>
              ) : (
                <span className="text-danger">Esperando Aprobacion</span>
              )}
            </div>
          </div>
        ) : (
          <PruebaInscripciones />
        )}
      </div>
    </div>
  );
}

export default Inscripcion;
