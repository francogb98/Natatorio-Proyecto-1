import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import style from "./style.module.css";

import EditarPerfil from "./EditarPerfil";

function Perfil({ user }) {
  return (
    <div className={style.body}>
      <h3>Editar Perfil</h3>
      <EditarPerfil usuario={user} />
    </div>
  );
}
export default Perfil;
