import { useContext, useEffect, useState } from "react";

import style from "./style.module.css";

import { useMutation } from "react-query";
import { cambiarFoto } from "../../../../helpers/usersFetch/imagen/cambiarFoto";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";

function Foto() {
  const { auth, userRefetch } = useContext(AuthContext);

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isImage, setIsImage] = useState(false);

  const cambiarFotoMutation = useMutation({
    mutationFn: cambiarFoto,
    onSuccess: () => {
      userRefetch();
      setLoading(false);
    },
    onError: (error) => {},
  });

  const preset_key = import.meta.env.VITE_REACT_APP_PRESET_KEY;
  const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsImage(true);

    // Crear un objeto FileReader para leer la imagen y obtener su URL
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result);
      previewUrl;
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
        cambiarFotoMutation.mutate({
          public_id_foto: res.data.public_id,
          foto: res.data.secure_url,
          id: auth.user._id,
        });
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  //borrAR IMAGEN EN CLOUDINARY

  useEffect(() => {}, [previewUrl]);

  return (
    <div className={style.editarFoto}>
      {auth.user.foto && (
        <img
          src={auth.user.foto}
          alt="Imagen seleccionada"
          className={style.imagenPerfil}
        />
      )}
      <h2 style={{ textAlign: "start" }}>
        {auth.user.foto ? "Cambiar foto" : "Agregar foto"}
      </h2>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          id="inputGroupFile02"
          onChange={handleFileChange}
        />
        <button
          className="input-group-text btn btn-success"
          onClick={uploadImage}
        >
          Cargar <i className="bi bi-file-earmark-arrow-up"></i>
        </button>
      </div>

      {previewUrl && !auth.user.foto && (
        <img
          src={previewUrl}
          alt="Imagen seleccionada"
          className="rounded mx-auto d-block mt-1"
          style={{
            maxWidth: "190px",
            height: "50px",
          }}
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
      </div>
    </div>
  );
}

export default Foto;
