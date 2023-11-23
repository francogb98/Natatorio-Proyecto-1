import axios from "axios";
import React, { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "react-query";
import { cargarFicha } from "../../../../helpers/usersFetch/cargarFicha";

function CargarArchivos({ usuario }) {
  const [cud, setCud] = useState();
  const [hongos, setHongos] = useState();
  const [ficha, setFicha] = useState();

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
  };

  const uploadImage = (e) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "file",
      e.target.name === "cud"
        ? cud
        : e.target.name === "hongos"
        ? hongos
        : ficha
    );

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
          tipo: e.target.name,
          id: usuario._id,
        });
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [success]);

  useEffect(() => {}, [loading]);
  useEffect(() => {
    if (postFicha.isSuccess) {
      setLoading(false);
      setSuccess(true);
    }
  }, [postFicha.isLoading]);

  return (
    <div>
      {usuario.natacionAdaptada && (
        <div className="mb-3">
          <h5 className="form-label">Cargar CUD</h5>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => handleFileChange(e, "cud")}
          />
          <button
            className="btn btn-dark mt-1"
            name="cud"
            onClick={uploadImage}
            disabled={!cud}
          >
            Cargar archivo
          </button>
        </div>
      )}

      <div className="mb-3">
        <h5 className="form-label">Cargar Certificado de hongos</h5>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(e) => handleFileChange(e, "hongos")}
        />
        <button
          className="btn btn-dark mt-1"
          name="hongos"
          onClick={uploadImage}
          disabled={!hongos}
        >
          Cargar archivo
        </button>
      </div>

      <div className="mb-3">
        <h5 className="form-label">Cargar Ficha Medica</h5>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(e) => handleFileChange(e, "ficha")}
        />
        <button
          className="btn btn-dark mt-1"
          name="ficha"
          onClick={uploadImage}
          disabled={!ficha}
        >
          Cargar archivo
        </button>
        <div className="mt-2 text-danger">
          <p>Si no tiene una ficha medica descargala haciendo click aqui</p>
          <a
            href="https://drive.google.com/uc?export=download&id=1ZsdIYcF75YOX7tFgCV_Qxh0tLrOCFIq0"
            download="fichaMedica.pdf"
          >
            Descargar ficha médica
          </a>
        </div>
      </div>

      {loading && (
        <div
          className="alert alert-warning"
          role="alert"
          style={{
            position: "absolute",
            // abajo a la derecha
            bottom: "0",
            right: "0",
            margin: "25px",
          }}
        >
          Cargando
        </div>
      )}
      {!loading && success && (
        <div
          className="alert alert-success"
          role="alert"
          style={{
            position: "absolute",
            // abajo a la derecha
            bottom: "0",
            right: "0",
            margin: "25px",
          }}
        >
          Archivo cargado con exito
        </div>
      )}
    </div>
  );
}

export default CargarArchivos;
