import { useState, useEffect } from "react";
import axios from "axios";

function InsertarFoto({
  setImageUrl,
  imageUrl,
  setUsuario,
  usuario,
  success,
  setSuccess,
}) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isImage, setIsImage] = useState(false);

  const preset_key = import.meta.env.VITE_REACT_APP_PRESET_KEY;
  const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsImage(true);

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

        setUsuario({
          ...usuario,
          foto: res.data.secure_url,
          public_id_foto: res.data.public_id,
        });
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (previewUrl) {
      uploadImage();
    }
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div className="mb-5">
      <h5 htmlFor="imagen" style={{ textAlign: "center" }}>
        Imagen de perfil
      </h5>

      {!success && (
        <p
          className="mx-auto text-danger mt-2"
          style={{
            width: "fit-content",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >
          Cargue una imagen, para establecerla como foto de perfil
        </p>
      )}
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
          className="form-control p-2"
          id="imagen"
          onChange={handleFileChange}
        />
        {usuario.foto && (
          <img
            src={usuario.foto}
            alt="Imagen seleccionada"
            className="rounded mx-auto d-block mt-1"
            style={{ maxWidth: "190px", height: "90px" }}
          />
        )}
        {previewUrl && !usuario.foto && (
          <img
            src={previewUrl}
            alt="Imagen seleccionada"
            className="rounded mx-auto d-block mt-1"
            style={{ maxWidth: "190px", height: "90px" }}
          />
        )}
        <div className="mt-1">
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
          {success && (
            <h4 className="text-success">Imagen cargada con exito</h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsertarFoto;
