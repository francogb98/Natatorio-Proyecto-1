import { useQuery } from "react-query";
import style from "./inicio.module.css";

import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate.js";

import Layout from "./tablaUsuariosTurnoActual/Layout.jsx";

function Inicio() {
  const usuarios = useQuery("getUsrsByDate", getActivitiesByDate);
  return (
    <section className={style.body}>
      <button className={style.button}>Agregar Usuario</button>

      <main className={style.main}>
        <h2>Registrar turno actual</h2>
        <Layout usuarios={usuarios} />
      </main>
    </section>
  );
}

export default Inicio;
