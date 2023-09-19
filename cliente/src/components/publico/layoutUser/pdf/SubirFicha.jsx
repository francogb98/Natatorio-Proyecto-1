//quiero previsualizar el archivo pdf que suba el ususario
import React, { useState } from "react";

import { useMutation } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import Swal from "sweetalert2";

const postFicha = async (data) => {
  const response = await fetch(baseUrl + "user/subir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  return res;
};

function SubirFicha({ id }) {
  const [ficha, setFicha] = useState(null);

  const fichaUpload = useMutation({
    mutationFn: postFicha,
    onSuccess: (data) => {
      if (data.ok) {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Ok",
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("llegeue aqui");

    console.log(ficha);
    console.log(id);
    if (ficha === null) {
      Swal.fire({
        title: "Error",
        text: "Debe seleccionar una imagen",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    fichaUpload.mutate({
      archivo: ficha,
      id,
    });
  };
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="file"
          name="ficha"
          id="ficha"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setFicha(reader.result);
            };
          }}
        />
        <button type="submit">Subir ficha</button>
      </form>
    </div>
  );
}

export default SubirFicha;
