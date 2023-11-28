import React, { useEffect, useState } from "react";
import axios from "axios";

import { useMutation, useQueryClient } from "react-query";
import { cambiarFoto } from "../../../../helpers/usersFetch/imagen/cambiarFoto";

const ProfileImageUpload = ({ usuario }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previousPublicId, setPreviousPublicId] = useState(
    usuario.public_id_foto || ""
  );
  // usuario.public_id_foto || "" // Guarda el public_id de la imagen anterior

  const queryClient = useQueryClient();

  const cambiarFotoMutation = useMutation({
    mutationFn: cambiarFoto,
    onSuccess: (data) => {
      queryClient.invalidateQueries("getUser");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const preset_key = import.meta.env.VITE_REACT_APP_PRESET_KEY;
  const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME;

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("Seleccione una imagen primero.");
      return;
    }

    try {
      // Eliminar la imagen anterior de Cloudinary si hay un public_id
      if (previousPublicId) {
        try {
          const formData = new FormData();
          formData.append("public_id", previousPublicId);
          formData.append("folder", preset_key);

          await axios.delete(usuario.foto);
          console.log("Imagen anterior borrada con éxito.");
        } catch (error) {
          console.error("Error al borrar la imagen anterior:", error);
        }
        //quiero que me devuelva un console log si la imagen feu borrada con exito
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", preset_key);
      formData.append("folder", preset_key);

      // Subir nueva imagen a Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      );

      console.log(response.data);

      const newImageUrl = response.data.secure_url;

      // Actualizar la URL de la imagen y el public_id en tu base de datos (simulado)
      // Debes realizar una petición al servidor para actualizar la URL y el public_id en la base de datos del usuario.

      cambiarFotoMutation.mutate({
        public_id_foto: response.data.public_id,
        foto: response.data.secure_url,
        id: usuario._id,
      });

      // Actualizar la vista previa con la nueva imagen y guardar el nuevo public_id
      setImageUrl(newImageUrl);
      setPreviousPublicId(response.data.public_id);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

export default ProfileImageUpload;
