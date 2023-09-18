import React from "react";

import avatar from "../../../helpers/avatar.webp";

function User({ getUserById }) {
  return (
    <>
      {getUserById.isSuccess && getUserById.data.status == "success" ? (
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

                <div>
                  Ficha Medica:{" "}
                  {getUserById.data.user.fichaMedica ? (
                    <a href={getUserById.data.user.fichaMedica}>
                      Ver ficha medica
                    </a>
                  ) : (
                    "No presentada"
                  )}
                </div>

                <div>
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
      {getUserById.isLoading ? (
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
      {getUserById.isSuccess && getUserById.data.status == "error" ? (
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
    </>
  );
}

export default User;
