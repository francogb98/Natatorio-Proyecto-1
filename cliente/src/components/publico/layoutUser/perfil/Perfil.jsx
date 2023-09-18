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

  const [showFicha, setShowFicha] = useState(false);
  const [fichaMedica, setFicha] = useState("");

  const handleViewFicha = ({ img }) => {
    setShowFicha(true);
    setFicha(img);
  };

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
          <img src={user.foto == undefined ? avatar : user.foto} alt="" />

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
          <div>
            {user.fichaMedica == undefined ? (
              <p>No has cargado tu ficha medica</p>
            ) : (
              <button
                onClick={() =>
                  handleViewFicha({
                    img: user.fichaMedica,
                  })
                }
              >
                Ver ficha
              </button>
            )}
          </div>
        </div>

        <div class="accordion" id="accordionExample">
          <div class="accordion-item" style={{ width: "400px" }}>
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Cargar Ficha
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
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
                    <InsertarFoto
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                    />
                    {ficha.isLoading ? (
                      <div className="text-center">
                        <p className="text-primary">
                          Puede tardar unos segundos
                        </p>
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
            </div>
          </div>
        </div>

        {showFicha ? (
          <div
            className="modal fade show"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ display: "block", paddingRight: "17px" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title"
                    id="exampleModalLabel"
                    style={{ color: "black" }}
                  >
                    Ficha Medica
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowFicha(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={fichaMedica}
                    alt="ficha medica"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowFicha(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return <h1>Cargando...</h1>;
  }
}

export default Perfil;
