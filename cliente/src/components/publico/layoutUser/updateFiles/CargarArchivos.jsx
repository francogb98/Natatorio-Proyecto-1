import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { cargarFicha } from "../../../../helpers/usersFetch/cargarFicha";

import { Link } from "react-router-dom";

function CargarArchivos({ usuario }) {
  const [cud, setCud] = useState();
  const [hongos, setHongos] = useState();
  const [ficha, setFicha] = useState();

  const [fotoPerfil, setFotoPerfil] = useState();
  const [documento, setDocumento] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

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
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
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
            <strong>CUD</strong> (Certificado Único de Discapacidad) en caso de
            tenerlo
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
        <div className="alert alert-info" role="alert">
          Cargando
        </div>
      )}
      {!loading && success && (
        <div className="alert alert-success" role="alert">
          Archivo cargado con éxito
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
    </div>
  );
}

export default CargarArchivos;
