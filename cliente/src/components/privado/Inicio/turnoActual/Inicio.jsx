import { useQuery } from "react-query";
import style from "./inicio.module.css";

import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate.js";

import useSocketPiletas from "../../../../hooks/useSocketPiletas.jsx.jsx";

import Layout from "./tablaUsuariosTurnoActual/Layout.jsx";

function Inicio() {
  const usuarios = useQuery("getUsrsByDate", getActivitiesByDate);

  const { socket, cargando, setCargando, error, success } = useSocketPiletas();

  return (
    <section className={style.body}>
      <div className={style.alert}>
        {cargando && (
          <div className="alert alert-warning">
            <h4 className="alert-heading">Cargando...</h4>
          </div>
        )}
        {success.success && (
          <div className="alert alert-success">
            <h4 className="alert-heading">{success.msg}</h4>
          </div>
        )}
        {error.error && (
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error.msg}</p>
          </div>
        )}
      </div>

      <button className={style.button}>Agregar Usuario</button>

      <main className={style.main}>
        <h2>Registrar turno actual</h2>
        <Layout socket={socket} setCargando={setCargando} usuarios={usuarios} />
      </main>
    </section>
  );
}

export default Inicio;
