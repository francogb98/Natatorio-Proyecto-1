import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import style from "./style.module.css";

import EditarPerfil from "./EditarPerfil";

function Perfil({ user }) {
  return (
    <div className={style.body}>
      <div className={style.buttonsGroup}>
        <button className="btn btn-lg btn-primary fw-bold">
          Ver Mi Perfil
        </button>
        <button className="btn btn-lg btn-info fw-bold">Editar Perfil</button>
        <button className="btn btn-lg btn-warning fw-bold">
          Cargar Archivos
        </button>
      </div>
      {/* <EditarPerfil usuario={user} /> */}
    </div>
  );
}
export default Perfil;
