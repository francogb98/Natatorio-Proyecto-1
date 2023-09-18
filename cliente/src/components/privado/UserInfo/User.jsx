import React, { useState } from "react";

import avatar from "../../../helpers/avatar.webp";

function User({ getUserById }) {
  const [showFicha, setShowFicha] = useState(false);
  const [ficha, setFicha] = useState("");

  const handleViewFicha = ({ img }) => {
    setShowFicha(true);
    setFicha(img);
  };
  return (
    <>
      {getUserById.isSuccess &&
      !showFicha &&
      getUserById.data.status == "success" ? (
        <div className="card">
          <img
            src={
              getUserById.data.user.foto ? getUserById.data.user.foto : avatar
            }
            className="card-img-top"
            style={{ width: "250px", height: "250px", margin: "auto" }}
            alt="..."
          />

          <div className="card-body">
            <h5 className="card-title">{getUserById.data.user.nombre}</h5>
            <h6>Id: {getUserById.data.user.customId}</h6>
            <div style={{ display: "flex" }}>
              <div>
                <p className="card-text">DNI: {getUserById.data.user.dni}</p>
                <p className="card-text">Edad: {getUserById.data.user.edad}</p>
                <p className="card-text">
                  Correo: {getUserById.data.user.email}
                </p>
                <p className="card-text">
                  Telefono: {getUserById.data.user.telefono}
                </p>
                <p className="card-text">
                  Telefono-Contacto: {getUserById.data.user.telefonoContacto}
                </p>
              </div>

              <div>
                {getUserById.data.user.activity.length ? (
                  <div>
                    <p className="card-text">
                      Actividad {getUserById.data.user.activity[0].name}
                    </p>
                    <p className="card-text">
                      Horario:
                      {getUserById.data.user.activity[0].hourStart} -{" "}
                      {getUserById.data.user.activity[0].hourFinish}
                    </p>
                    <p className="card-text">
                      Dias:
                      {getUserById.data.user.activity[0].date.join(" - ")}
                    </p>
                  </div>
                ) : (
                  <p className="card-text">Actividad: No esta inscripto</p>
                )}

                <div className="mt-1">
                  Ficha Medica:{" "}
                  {getUserById.data.user.fichaMedica ? (
                    <button
                      onClick={() =>
                        handleViewFicha({
                          img: getUserById.data.user.fichaMedica,
                        })
                      }
                    >
                      Ver ficha medica
                    </button>
                  ) : (
                    "No presentada"
                  )}
                </div>

                <div className="mt-1">
                  Role:
                  {getUserById.data.user.role}
                </div>
              </div>
            </div>

            <hr />
            <button
              href="#"
              className="btn btn-danger"
              onClick={() => {
                getUserById.reset();
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      {getUserById.isLoading && !showFicha ? (
        <div className="card" aria-hidden="true">
          <img
            src={avatar}
            className="card-img-top"
            alt="..."
            style={{ width: "250px", height: "250px", margin: "auto" }}
          />
          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6"></span>
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-8"></span>
            </p>
            <a
              className="btn btn-primary disabled placeholder col-6"
              aria-disabled="true"
            ></a>
          </div>
        </div>
      ) : null}
      .
      {getUserById.isSuccess &&
      !showFicha &&
      getUserById.data.status == "error" ? (
        <>
          <h1>Usuario no encontrado</h1>
          <button
            className="btn btn-danger"
            onClick={() => {
              getUserById.reset();
            }}
          >
            Close
          </button>
        </>
      ) : null}
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
                  src={ficha}
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
    </>
  );
}

export default User;
