import { useState, useEffect } from "react";
import axios from "axios";
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
      {!usuario.natacionAdaptada &&
        usuario.certificadoHongos &&
        usuario.fichaMedica && (
          <div className="alert alert-success" role="alert">
            Ya cargaste todos los archivos
          </div>
        )}

      {usuario.natacionAdaptada &&
        usuario.cud &&
        usuario.certificadoHongos &&
        usuario.fichaMedica && (
          <div className="alert alert-success" role="alert">
            Ya cargaste todos los archivos
          </div>
        )}

      {loading && (
        <div className="alert alert-warning" role="alert">
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

      <div className="mb-3">
        <h5 className="form-label">Cargar Certificado de hongos</h5>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(e) => handleFileChange(e, "hongos")}
        />
      </div>

      <div className="mb-3">
        <h5 className="form-label">Cargar Ficha Medica</h5>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(e) => handleFileChange(e, "ficha")}
        />

        <div className="mt-2 text-danger">
          <a
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
