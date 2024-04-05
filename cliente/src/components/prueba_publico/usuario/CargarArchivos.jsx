import React, { useState } from "react";
import editar_datos from "../funciones_usuario/editar_datos.hook";

import { Toaster, toast } from "sonner";
import UserImages from "../../prueba/users/utilidades/UserImages";

function CargarArchivos({ user }) {
  const { cargarArchivo } = editar_datos();

  const [view, setView] = useState(false);
  const [imagen, setImagen] = useState("");

  const subirArchivo = async (e) => {
    e.preventDefault();

    //verifico que el archivo sea una imagen
    if (
      e.target.files[0].type !== "image/png" &&
      e.target.files[0].type !== "image/jpg" &&
      e.target.files[0].type !== "image/jpeg"
    ) {
      toast.error("El archivo no es una imagen");
      return;
    }

    if (e.target.files[0].size > 4000000) {
      toast.error("El archivo pesa mas de 4mb");

      return;
    }
    const archivoConNuevoNombre = new File([e.target.files[0]], e.target.name, {
      type: e.target.files[0].type,
    });

    const formData = new FormData();
    formData.append("archivo", archivoConNuevoNombre);
    toast.info("Cargando archivo");
    cargarArchivo.mutate(formData);
  };

  return (
    <>
      <section className="row py-3">
        <div className="col-12 col-sm-6">
          <h2 className="text-center text-success">Archivos</h2>
          <p className="mt-md-5">
            Ficha Medica:
            {user.fichaMedica ? (
              <span
                onClick={() => {
                  setView(true);
                  setImagen(user.fichaMedica);
                }}
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Abrir
              </span>
            ) : (
              <span
                className={`fw-bold "text-danger"
              `}
              >
                {" "}
                No cargado
              </span>
            )}
          </p>
          <p>
            Certificado Pediculosis y Micosis :
            {user.certificadoHongos ? (
              <span
                onClick={() => {
                  setView(true);
                  setImagen(user.certificadoHongos);
                }}
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Abrir
              </span>
            ) : (
              <span
                className={`fw-bold "text-danger"
              `}
              >
                {" "}
                No cargado
              </span>
            )}
          </p>
          <p>
            Fecha de carga Certificado Pediculosis y Micosis :
            <span
              className={`fw-bold ${
                user.certificadoHongos ? "text-success" : "text-danger"
              }`}
            >
              {" "}
              {user.certificadoHongos
                ? user.fechaCargaCertificadoHongos
                : "No cargado"}
            </span>
          </p>
          <p>
            Foto Documento:
            {user.fotoDocumento ? (
              <span
                onClick={() => {
                  setView(true);
                  setImagen(user.fotoDocumento);
                }}
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Abrir
              </span>
            ) : (
              <span
                className={`fw-bold "text-danger"
              `}
              >
                {" "}
                No cargado
              </span>
            )}
          </p>

          {user.natacionAdaptada && (
            <p>
              CUD:
              {user.cud ? (
                <span
                  onClick={() => {
                    setView(true);
                    setImagen(user.cud);
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Abrir
                </span>
              ) : (
                <span
                  className={`fw-bold "text-danger"
              `}
                >
                  {" "}
                  No cargado
                </span>
              )}
            </p>
          )}
        </div>
        <div className="col-12 col-sm-6">
          <h2 className="text-center text-success">Cargar Archivos</h2>
          <form action="">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Foto de perfil
              </label>
              <input
                className="form-control"
                type="file"
                name="foto"
                id="formFile"
                onChange={subirArchivo}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Ficha Medica
              </label>
              <input
                type="file"
                className="form-control"
                name="fichaMedica"
                onChange={subirArchivo}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Certificado PyM
              </label>
              <input
                type="file"
                className="form-control"
                name="certificadoHongos"
                onChange={subirArchivo}
              />
            </div>
            {user.natacionAdaptada && (
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  CUD
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  name="cud"
                  onChange={subirArchivo}
                />
              </div>
            )}
            <div>
              <label htmlFor="" className="form-label">
                Foto DNI
              </label>
              <input
                type="file"
                className="form-control"
                name="fotoDocumento"
                onChange={subirArchivo}
              />
            </div>
          </form>
        </div>
      </section>

      {view && (
        <UserImages imagen={imagen} setView={setView} setImagen={setImagen} />
      )}

      <Toaster position="bottom-left" richColors />
    </>
  );
}

export default CargarArchivos;
