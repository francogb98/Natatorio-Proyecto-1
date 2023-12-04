import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import { Link, useLocation } from "react-router-dom";

import style from "./style.module.css";

import EditarPerfil from "./EditarPerfil";

function Perfil() {
  return (
    <div className={style.body}>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">
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
              class="bi bi-file-earmark-arrow-up-fill"
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
              class="bi bi-person-fill"
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
