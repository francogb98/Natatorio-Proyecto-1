import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import style from "./style.module.css";

import EditarPerfil from "./EditarPerfil";

function Perfil({ user }) {
  return (
    <div className={style.body}>
      <EditarPerfil usuario={user} />
    </div>
  );
}
export default Perfil;
