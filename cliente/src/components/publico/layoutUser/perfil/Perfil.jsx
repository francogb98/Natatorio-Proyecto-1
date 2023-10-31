import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import style from "./style.module.css";

//traigo la imagen de helpers
import avatar from "../../../../helpers/avatar.webp";
import Swal from "sweetalert2";
import { getInfoUser } from "../../../../helpers/fetch";
import EditarPerfil from "./EditarPerfil";
import CargarArchivos from "./CargarArchivos";
import CardPerfil from "./CardPerfil";

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
  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        return data;
      }
    },
  });

  const [imageUrl, setImageUrl] = useState(null);

  const [showFicha, setShowFicha] = useState(false);
  const [fichaMedica, setFicha] = useState("");

  const [editarPerfil, setEditarPerfil] = useState(false);
  const [cargarArchivos, setCargarArchivos] = useState(false);
  const [showCard, setShowCard] = useState(true);

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

  const cargarFicha = () => {
    ficha.mutate({ fichaMedica: imageUrl, id: getUser.data.user._id });
  };

  if (!getUser.data) {
    return (
      <>
        <h1>Usuario no encontrado </h1>
        <button
          onClick={() => {
            getUser.refetch();
          }}
          className="btn btn-primary"
        >
          Recargar
        </button>
      </>
    );
  }

  const user = getUser.data.user;

  console.log(user.activity);

  return (
    <div className={style.body}>
      <div className={style.header}>
        <div className={style.seccionFoto}>
          {user.foto && (
            <img src={user.foto == undefined ? avatar : user.foto} alt="" />
          )}

          <div>
            <h2>
              {user.nombre
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
              {user.apellido
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>

            <h3 style={{ color: "blue" }}>
              <span style={{ color: "red" }}>ID Usuario:</span>
              {user.customId}
            </h3>
            {user.natacionAdaptada && (
              <p style={{ color: "blue" }}>
                <span style={{ color: "blue" }}>Natacion Adaptada</span>
              </p>
            )}
          </div>
        </div>

        <div className={style.button_group}>
          <button
            className={`btn btn-warning ${style.button_estado}`}
            onClick={() => {
              setEditarPerfil(false);
              setCargarArchivos(false);
              setShowCard(true);
            }}
          >
            <i className="bi bi-pencil-fill me-2"></i>Estado
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              setEditarPerfil(true);
              setCargarArchivos(false);
              setShowCard(false);
            }}
          >
            <i className="bi bi-pencil-fill me-2"></i>Editar perfil
          </button>
          <button
            className="btn btn-primary "
            onClick={() => {
              setEditarPerfil(false);
              setCargarArchivos(true);
              setShowCard(false);
            }}
          >
            <i className="bi bi-file-earmark-arrow-up-fill"></i> Cargar Archivos
          </button>
        </div>
      </div>

      <div className={style.seccionBody}>
        {!showCard && (
          <div className={style.card_section}>
            <CardPerfil user={user} />
          </div>
        )}
        {/* //input de prueba para leer un archivo pdf y cargarlo en la bdd */}

        {/* <div>
            <h3>Cargar ficha medica</h3>
            <p>
              Si no tiene una ficha medica descargala en el siguiente enlace
            </p>
            <a
              href="https://drive.google.com/uc?export=download&id=1ZsdIYcF75YOX7tFgCV_Qxh0tLrOCFIq0"
              download="fichaMedica.pdf"
            >
              Descargar ficha médica
            </a>
          </div> */}

        {editarPerfil ? <EditarPerfil usuario={user} /> : null}
        {showCard ? <CardPerfil user={user} /> : null}

        {cargarArchivos ? <CargarArchivos usuario={user} /> : null}
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
}
export default Perfil;
