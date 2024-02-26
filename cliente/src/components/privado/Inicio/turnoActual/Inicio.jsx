import { useQuery } from "react-query";

import { getActivitiesByDate } from "../../../../helpers/activitiesFetch/getActivitiesByDate.js";

import Layout from "./tablaUsuariosTurnoActual/Layout.jsx";

function Inicio() {
  const usuarios = useQuery("getUsrsByDate", getActivitiesByDate);

  if (usuarios.isLoading)
    return (
      <div className="alert alert-secondary text-center">
        <h3>Cargando Usuarios turno actual por favor espere...</h3>
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXloaXYzamtheW4yZ3Q0a2FwMG16aGw2ZGZxZWNmOWNzanE4M2lsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WFEpbNDqjs312EZ06H/giphy.gif"
          alt="Dog Swimming Sticker by Rede Genoma"
          style={{ width: "30%" }}
        ></img>
      </div>
    );

  return (
    <div className="text-center">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Turno Actual</h1>
      </div>
      <Layout usuarios={usuarios}></Layout>
    </div>
  );
}

export default Inicio;
