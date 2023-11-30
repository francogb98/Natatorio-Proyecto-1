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
      <h1>Pasos a seguir para la inscripcion en actividades</h1>
      <section className={style.section}>
        <div className={`${style.sectionItem}`}>
          <span className="bg-warning">1</span>

          <div className={style.infoSection}>
            <p>Carga de Archivos</p>
            <small>(Dirigete a la seccion perfil)</small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">2</span>{" "}
          <div className={style.infoSection}>
            <p>Inscripcion en Actividades</p>
            <small>(Dirigete a la seccion Actividades)</small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">3</span>
          <div className={style.infoSection}>
            <p>Aprobacion de Inscripcion</p>
            <small>
              (Tendras una notificacion en cuanto veamos tu registro)
            </small>
          </div>
        </div>
        <div className={style.sectionItem}>
          <span className="bg-warning">4</span> <p>¡A Disfrutar!</p>
        </div>
      </section>
    </div>
  );
}

export default HomeUser;
