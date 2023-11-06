import React from "react";
import CardPerfil from "./CardPerfil";

import style from "./homeUser.module.css";

import { Link } from "react-router-dom";

function HomeUser({ user }) {
  const [showFicha, setShowFicha] = React.useState(false);

  const [fichaMedica, setFicha] = React.useState("");

  const handleViewFicha = ({ img }) => {
    setShowFicha(true);
    setFicha(img);
  };

  return (
    <div className={style.body}>
      <p className={style.title}>
        A continuacion veras el estado de tus archivos, una vez que todos esten
        cargados en la seccion de{" "}
        <Link to={"updateFiles"}>Cargar Archivos</Link> podras acceder a la
        parte de <Link to={"inscripcion"}>Actividades</Link> y registrarte{" "}
      </p>
      <CardPerfil user={user} handleViewFicha={handleViewFicha} />

      {showFicha ? (
        <div
          className="modal fade show"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{ color: "black" }}
                >
                  Ficha Medica
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowFicha(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={fichaMedica}
                  alt="ficha medica"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowFicha(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HomeUser;
