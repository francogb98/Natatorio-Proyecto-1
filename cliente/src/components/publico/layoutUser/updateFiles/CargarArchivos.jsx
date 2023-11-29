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
        setSuccess(true); // Cambio agregado para activar la alerta de éxito automáticamente
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

  useEffect(() => {
    if (postFicha.isSuccess) {
      setLoading(false);
    }
  }, [postFicha.isLoading]);

  return (
    <div>
      {/* Resto del código del componente */}
      {loading && (
        <div
          className="alert alert-warning"
          role="alert"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            margin: "25px",
          }}
        >
          Cargando
        </div>
      )}
      {/* Modificación: Mostrar la alerta de éxito automáticamente */}
      {!loading && success && (
        <div
          className="alert alert-success"
          role="alert"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            margin: "25px",
          }}
        >
          Archivo cargado con éxito
        </div>
      )}
    </div>
  );
}

export default CargarArchivos;
