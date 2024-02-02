import { Link } from "react-router-dom";

import style from "./style.module.css";

function Perfil() {
  return (
    <div className={style.body}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Perfil /
          </li>
        </ol>
      </nav>
      <div className={style.buttonsGroup}>
        <Link to={"updateFiles"}>
          <button
            className="btn btn-lg btn-warning fw-bold"
            style={{
              width: "250px",
            }}
          >
            Cargar Archivos{" "}
            <i
              className="bi bi-file-earmark-arrow-up-fill"
              style={{
                fontSize: "1.5rem",
                marginLeft: "10px",
              }}
            ></i>
          </button>
        </Link>

        <Link to={"editarPerfil"}>
          <button
            className="btn btn-lg btn-primary fw-bold"
            style={{
              width: "250px",
            }}
          >
            Ver Mi Perfil{" "}
            <i
              className="bi bi-person-fill"
              style={{
                fontSize: "1.5rem",
                marginLeft: "10px",
              }}
            ></i>
          </button>
        </Link>
        <Link to={"/user/feedback"}>
          <button
            className="btn btn-lg btn-secondary fw-bold"
            style={{
              width: "250px",
            }}
          >
            Enviar Comentario{" "}
            <i
              className="bi-chat-left-dots"
              style={{
                fontSize: "1.5rem",
                marginLeft: "10px",
              }}
            ></i>
          </button>
        </Link>
      </div>
      {/* <EditarPerfil usuario={user} /> */}
    </div>
  );
}
export default Perfil;
