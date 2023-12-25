import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { cargarFicha } from "../../../../helpers/usersFetch/cargarFicha";

import { Link } from "react-router-dom";

import Swal from "sweetalert2";

function CargarArchivos({ usuario }) {
  const [imagen, setImagen] = useState();

  const [cud, setCud] = useState();
  const [hongos, setHongos] = useState();
  const [ficha, setFicha] = useState();

  const [fotoPerfil, setFotoPerfil] = useState();
  const [documento, setDocumento] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editarFotoPerfil, setEditarFotoPerfil] = useState(false);
  const [editarDocumento, setEditarDocumento] = useState(false);
  const [editarCud, setEditarCud] = useState(false);
  const [editarHongos, setEditarHongos] = useState(false);
  const [editarFicha, setEditarFicha] = useState(false);

  const queryClient = useQueryClient();

  const postFicha = useMutation(cargarFicha, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  const preset_key = import.meta.env.VITE_REACT_APP_PRESET_KEY;
  const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME;

  const handleFileChange = (e, inputIdentifier) => {
    const selectedFile = e.target.files[0];

    if (inputIdentifier === "cud") {
      setCud(selectedFile);
    }
    if (inputIdentifier === "hongos") {
      setHongos(selectedFile);
    }
    if (inputIdentifier === "ficha") {
      setFicha(selectedFile);
    }
    if (inputIdentifier === "fotoPerfil") {
      setFotoPerfil(selectedFile);
    }
    if (inputIdentifier === "documento") {
      setDocumento(selectedFile);
    }
  };

  const uploadImage = (file, tipo) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    formData.append("folder", preset_key);

    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then((res) => {
        setError(false);
        postFicha.mutate({
          archivo: res.data.secure_url,
          tipo: tipo,
          id: usuario._id,
        });
        setSuccess(true);

        Swal.fire({
          icon: "success",
          title: "Archivo cargado con éxito",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Formato de archivo incorrecto",
        });

        //reiniciar valores
      })
      .finally(() => {
        setLoading(false);
        //reiniciar los campos de input file
        // document.getElementById('miInputFile').value = '';

        document.getElementById("formFile").value = "";
      });
  };

  useEffect(() => {
    if (cud) {
      uploadImage(cud, "cud");
    }
  }, [cud]);

  useEffect(() => {
    if (hongos) {
      uploadImage(hongos, "hongos");
    }
  }, [hongos]);

  useEffect(() => {
    if (ficha) {
      uploadImage(ficha, "ficha");
    }
  }, [ficha]);

  useEffect(() => {
    if (fotoPerfil) {
      uploadImage(fotoPerfil, "fotoPerfil");
    }
  }, [fotoPerfil]);

  useEffect(() => {
    if (documento) {
      uploadImage(documento, "documento");
    }
  }, [documento]);

  useEffect(() => {
    if (success) {
      setEditarFotoPerfil(false);
      setEditarFicha(false);
      setEditarDocumento(false);
      setEditarCud(false);
      setEditarHongos(false);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [success]);

  useEffect(() => {
    if (postFicha.isSuccess) {
      setLoading(false);
    }
  }, [postFicha.isLoading]);

  return (
    <>
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"perfil"}>Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <strong>Cargar Archivos</strong>
            </li>
          </ol>
        </nav>

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
              <strong>Certificado de hongos</strong> (con la firma del médico)
            </li>
            <li>
              <strong>Ficha médica completa</strong> (descargarla desde el botón
              de abajo)
            </li>
          </ul>

          <hr />
          <p className="mb-0">
            <strong>
              <i className="bi bi-exclamation-circle-fill me-2"></i>A la par de
              cada archivo, se encuentra un ícono que indica si el archivo fue
              cargado correctamente
            </strong>
          </p>
        </div>

        {loading && (
          <div
            className="alert alert-primary"
            role="alert"
            style={{
              //que aparezca fijo arriba
              position: "sticky",
              top: "0",
              zIndex: "1",
            }}
          >
            Cargando archivo...
          </div>
        )}

        {usuario.natacionAdaptada && (
          <div className="mb-3">
            <h5 className="form-label">Cargar CUD</h5>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => handleFileChange(e, "cud")}
            />
          </div>
        )}

        {usuario.foto && !editarFotoPerfil && (
          <div className="mb-3">
            <h5 className="form-label fw-bold">
              Foto de perfil Cargada{" "}
              {usuario.foto ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setImagen(usuario.foto)}
              >
                Ver Imagen
              </button>
              <button
                className="btn btn-warning ms-3"
                onClick={() => setEditarFotoPerfil(true)}
              >
                Editar Imagen
              </button>
            </div>
          </div>
        )}

        {(!usuario.foto || editarFotoPerfil) && (
          <div className="mb-5">
            <h5 className="form-label fw-bold">
              Subir foto de perfil usuario{" "}
              {usuario.foto ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => handleFileChange(e, "fotoPerfil")}
            />
          </div>
        )}

        {usuario.fotoDocumento && !editarDocumento && (
          <div className="mb-3">
            <h5 className="form-label fw-bold">
              Foto de documento cargada{" "}
              {usuario.fotoDocumento ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setImagen(usuario.fotoDocumento)}
              >
                Ver Imagen
              </button>
              <button
                className="btn btn-warning ms-3"
                onClick={() => setEditarDocumento(true)}
              >
                Editar Imagen
              </button>
            </div>
          </div>
        )}

        {(!usuario.fotoDocumento || editarDocumento) && (
          <div className="mb-5">
            <h5 className="form-label fw-bold">
              Subir foto del documento (parte frontal){" "}
              {usuario.fotoDocumento ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => handleFileChange(e, "documento")}
            />
          </div>
        )}

        {usuario.certificadoHongos && !editarHongos && (
          <div className="mb-3">
            <h5 className="form-label fw-bold">
              Certificado de hongos cargado{" "}
              {usuario.certificadoHongos ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setImagen(usuario.certificadoHongos)}
              >
                Ver Imagen
              </button>
              <button
                className="btn btn-warning ms-3"
                onClick={() => setEditarHongos(true)}
              >
                Editar Archivo
              </button>
            </div>
          </div>
        )}

        {(!usuario.certificadoHongos || editarHongos) && (
          <div className="mb-5">
            <h5 className="form-label fw-bold">
              Subir Certificado de hongos{" "}
              {usuario.certificadoHongos ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => handleFileChange(e, "hongos")}
            />
          </div>
        )}

        {usuario.fichaMedica && !editarFicha && (
          <div className="mb-3">
            <h5 className="form-label fw-bold">
              Ficha medica cargada{" "}
              {usuario.fichaMedica ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setImagen(usuario.fichaMedica)}
              >
                Ver Archivo
              </button>
              <button
                className="btn btn-warning ms-3"
                onClick={() => setEditarFicha(true)}
              >
                Editar Archivo
              </button>
            </div>
          </div>
        )}

        {(!usuario.fichaMedica || editarFicha) && (
          <div className="mb-5">
            <h5 className="form-label fw-bold">
              Subir Ficha Medica (completada){" "}
              {usuario.fichaMedica ? (
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </h5>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => handleFileChange(e, "ficha")}
            />

            <div className="mt-2 text-danger">
              <a
                className="btn btn-danger"
                href="https://drive.google.com/uc?export=download&id=1ZsdIYcF75YOX7tFgCV_Qxh0tLrOCFIq0"
                download="fichaMedica.pdf"
              >
                Descargar ficha médica
              </a>
            </div>
          </div>
        )}
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={imagen}
                alt="archivo"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setImagen(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CargarArchivos;
