import React, { useEffect, useState } from "react";
import axios from "axios";

function InsertarFoto({ setImageUrl, imageUrl }) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const preset_key = import.meta.env.VITE_REACT_APP_PRESET_KEY;
  const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME;
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Crear un objeto FileReader para leer la imagen y obtener su URL
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };
  const uploadImage = () => {
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
        setLoading(false);
        setError(false);
        setSuccess(true);
        setImageUrl(res.data.secure_url);
      })
      .catch((err) => setError(true));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [success]);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, []);

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <input
          type="file"
          className="form-control p-2 "
          id="imagen"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Imagen seleccionada"
            className="rounded mx-auto d-block mt-1"
            style={{ maxWidth: "250px", height: "150px" }}
          />
        )}
        <div className="mt-1 ">
          {loading && (
            <div className="text-center">
              <p className="text-primary">Puede tardar unos segundos</p>
              <div
                className="spinner-border"
                role="status"
                style={{ marginTop: "-4px" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {error && (
            <p className="text-danger">
              Ocurrio un error, recargue y vuelva a intentarlo
            </p>
          )}
          {success && <h4 className="text-success">Imagen Update</h4>}
        </div>

        <button
          type="button"
          className="btn btn-light fw-bold mt-3"
          disabled={imageUrl}
          onClick={uploadImage}
        >
          {imageUrl ? "Imagen cargada" : "Cargar imagen"}
        </button>
      </div>

      {!imageUrl && (
        <h4
          className="mx-auto text-danger mt-2"
          style={{ width: "fit-content" }}
        >
          Cargue una imagen para continuar
        </h4>
      )}
      <br />
      <hr />
    </div>
  );
}

export default InsertarFoto;
