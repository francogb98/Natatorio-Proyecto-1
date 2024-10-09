import React from "react";
import CargarArchivos from "./CargarArchivos";

import style from "./style.module.css";

function UpdateFiles({ user }) {
  return (
    <div className={style.body}>
      <CargarArchivos usuario={user} />
    </div>
  );
}

export { UpdateFiles };
