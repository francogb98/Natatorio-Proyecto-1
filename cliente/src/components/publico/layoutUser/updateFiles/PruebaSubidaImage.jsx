import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { baseUrl } from "../../../../helpers/url";
import Swal from "sweetalert2";

const updateFile = async (data) => {
  const res = await fetch(`${baseUrl}user/upload`, {
    method: "PUT",
    headers: {
      "x-token": localStorage.getItem("token"),
      authorization: `${localStorage.getItem("token")}`,
    },
    body: data,
  });
  return res.json();
};

function PruebaSubidaImage() {
  const mutation = useMutation(updateFile, {
    onSuccess: (data) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Archivo subido con exito",
        showConfirmButton: true,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al subir el archivo",
        showConfirmButton: true,
        timer: 1500,
      });
    },
  });

  const subirArchivo = async (e) => {
    e.preventDefault();

    //verifico que el archivo sea una imagen
    if (
      e.target.files[0].type !== "image/png" &&
      e.target.files[0].type !== "image/jpg" &&
      e.target.files[0].type !== "image/jpeg"
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "El archivo no es una imagen",
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    //verifico que el archivo no pese mas de 2mb
    if (e.target.files[0].size > 2000000) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "El archivo pesa mas de 2mb",
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    const archivoConNuevoNombre = new File([e.target.files[0]], e.target.name, {
      type: e.target.files[0].type,
    });

    const formData = new FormData();
    formData.append("archivo", archivoConNuevoNombre);

    mutation.mutate(formData);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      {mutation.isLoading ? (
        <div
          className="alert alert-primary text-center"
          role="alert"
          style={{
            //que aparezca fijo arriba
            position: "sticky",
            top: "0",
            zIndex: "1",
          }}
        >
          <h4 className="fw-bold">Cargando archivo por favor espere...</h4>
          <img
            src="https://media3.giphy.com/media/huOej08UYQYtAjH22E/giphy.gif?cid=ecf05e4722zlimap43nxwgs1uw1zfah471tybh9f7d5c2iap&amp;ep=v1_gifs_related&amp;rid=giphy.gif&amp;ct=s"
            // alt="Water Swimming Sticker by MySwimPro"
            // style="width: 500px; height: 281.25px; left: 0px; top: 0px;"
            style={{
              width: "60%",
            }}
          />
        </div>
      ) : (
        <>
          <div className="alert alert-warning">
            <h5 className="alert-heading">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Importante
            </h5>
            <p>
              <strong>
                Para poder inscribirte a las actividades, debes cargar los
                siguientes archivos
              </strong>
              (por unica vez):
            </p>
            <ul>
              <li>
                <strong>Foto de perfil</strong>
              </li>

              <li>
                <strong>Documento</strong> (parte frontal)
              </li>

              <li>
                <strong>CUD</strong> (Certificado Único de Discapacidad) en caso
                de tenerlo
              </li>
              <li>
                <strong>Certificado de pediculosis y micosis</strong> (con la
                firma del médico, se debe actualizar cada 1 mes)
              </li>
              <li>
                <strong>Ficha médica completa</strong> (descargarla desde el
                botón de abajo)
              </li>
            </ul>

            <hr />
            <p className="mb-0">
              <strong>
                <i className="bi bi-exclamation-circle-fill me-2"></i>A la par
                de cada archivo, se encuentra un ícono que indica si el archivo
                fue cargado correctamente
              </strong>
            </p>
          </div>
          <div>
            <div className="mb-3">
              <h5 className="form-label">Cargar Ficha Medica</h5>
              <input
                type="file"
                name="fichaMedica"
                onChange={subirArchivo}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <h5 className="form-label">Cargar Foto de Perfil</h5>
              <input
                type="file"
                name="foto"
                onChange={subirArchivo}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <h5 className="form-label">Cargar Foto Documento</h5>
              <input
                type="file"
                name="fotoDocumento"
                onChange={subirArchivo}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <h5 className="form-label">
                Cargar Certificado pediculosis y micosis
              </h5>
              <input
                type="file"
                name="certificadoHongos"
                onChange={subirArchivo}
                className="form-control"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PruebaSubidaImage;
