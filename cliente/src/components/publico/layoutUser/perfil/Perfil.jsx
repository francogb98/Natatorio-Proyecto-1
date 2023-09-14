import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useMutation } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import style from "./style.module.css";

import ficaMedica from "./fichaMedica.pdf";

//traigo la imagen de helpers
import avatar from "../../../../helpers/avatar.webp";
import InsertarFoto from "../../registro/Foto";
import Swal from "sweetalert2";

const postFicha = async (data) => {
  const response = await fetch(baseUrl + "user/cargaFicha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  return res;
};

function Perfil() {
  const { getUser } = useContext(AuthContext);

  const [imageUrl, setImageUrl] = useState(null);
  const [show, setShow] = useState(false);

  const ficha = useMutation({
    mutationFn: postFicha,
    onSuccess: (data) => {
      Swal.fire({
        title: data.status.toUpperCase(),
        text: data.message,
        icon: data.status,
        confirmButtonText: "Aceptar",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: error.status.toUpperCase(),
        text: error.message,
        icon: error.status,
        confirmButtonText: "Aceptar",
      });
    },
  });

  useEffect(() => {
    getUser;
  }, []);

  const cargarFicha = () => {
    ficha.mutate({ fichaMedica: imageUrl, id: getUser.data.user._id });
  };

  if (getUser.isSuccess) {
    const user = getUser.data.user;

    return (
      <div className={style.body}>
        <div className={style.bodyPerfil}>
          <img
            src={user.foto == undefined || user.foto ? avatar : user.foto}
            alt=""
          />

          <h2>{user.nombre}</h2>
          <h2>{user.email}</h2>

          <p>
            <span>DNI:</span>
            {user.dni}
          </p>
          <h3 style={{ color: "blue" }}>
            <span style={{ color: "red" }}>ID Usuario:</span>
            {user.customId}
          </h3>

          {user.activity[0] == undefined ? (
            <p>No estas inscripto a ninguna actividad</p>
          ) : !user.status ? (
            <p
              className="alert alert-danger fw-bold"
              style={{ width: "fit-content" }}
            >
              Esperando confirmacion de inscripcion
            </p>
          ) : (
            <>
              <p>
                <span> Actividad:</span>
                {user.activity[0].name}
              </p>
              <p>
                <span>Horario Ingreso:</span>
                {user.activity[0].hourStart}
              </p>
              <p>
                <span>Horario Salida:</span>
                {user.activity[0].hourFinish}
              </p>
              <p>
                <span>Dias : </span>
                {user.activity[0].date.join(" - ")}
              </p>
            </>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {user.fichaMedica == undefined ? (
              <p>No has cargado tu ficha medica</p>
            ) : (
              <button
                onClick={() => setShow(!show)}
                className="btn btn-success"
                style={{ width: "fit-content" }}
              >
                {show ? "Ocultar ficha" : "Ver ficha"}
              </button>
            )}
            {show ? (
              <img
                src={user.fichaMedica}
                alt=""
                style={{ height: "700px", width: "400px" }}
              />
            ) : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <h3>Descagar Ficha</h3>
            <a
              href="https://drive.google.com/uc?export=download&id=1ZsdIYcF75YOX7tFgCV_Qxh0tLrOCFIq0"
              download="fichaMedica.pdf"
            >
              <button className="btn btn-lg btn-info text-white fw-bold">
                Descargar ficha médica
              </button>
            </a>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <h3 htmlFor="imagen">Cargar Ficha</h3>
            <InsertarFoto imageUrl={imageUrl} setImageUrl={setImageUrl} />
            {ficha.isLoading ? (
              <div className="text-center">
                <p className="text-primary">Puede tardar unos segundos</p>
                <div
                  className="spinner-border"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null}
            <button
              className="btn btn-success"
              disabled={imageUrl == null}
              onClick={cargarFicha}
            >
              Subir Ficha
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Cargando...</h1>;
  }
}

export default Perfil;
