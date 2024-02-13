import { useContext } from "react";
import { baseUrl } from "../../../../helpers/url";
import style from "./style.module.css";

import { useMutation } from "react-query";
import { AuthContext } from "../../../../context/AuthContext";

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

function Foto() {
  const { auth } = useContext(AuthContext);

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

  console.log(auth);

  return (
    <div className="text-center">
      <img
        src={auth.user.foto}
        alt=""
        style={{
          width: "40%",
        }}
      />
      <div className="mb-3">
        <h4 className="form-label">Cargar Ficha Medica</h4>
        <input
          type="file"
          name="fichaMedica"
          onChange={subirArchivo}
          className="form-control"
        />
      </div>
    </div>
  );
}

export default Foto;
