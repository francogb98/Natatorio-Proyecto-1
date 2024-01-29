import { useState } from "react";
import { baseUrl } from "../../../../helpers/url";

import { useMutation } from "react-query";

import Swal from "sweetalert2";

const mandarFeed = async (content) => {
  try {
    const resp = await fetch(baseUrl + "user/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(content),
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};

function Feed() {
  const [content, setContent] = useState({
    content: "",
  });

  const mutate = useMutation({
    mutationKey: "feed",
    mutationFn: mandarFeed,
    onSuccess: (data) => {
      console.log(data);
      if (data.status === "success") {
        Swal.fire({
          title: "Mensaje enviado con Exito",
          text: "Se ha enviado correctamente el mensaje",
          icon: data.status,
        });
        setContent({
          content: "",
        });
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate(content);
  };
  return (
    //creame un formulario para enviar un mensaje
    <div
      style={{
        height: "70vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "aliceblue",
      }}
    >
      <form
        style={{
          width: "50%",
        }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <h3>Dejanos un mensaje</h3>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={content.content}
            onChange={(e) => {
              setContent({
                ...content,
                content: e.target.value,
              });
            }}
          ></textarea>
        </div>
        {mutate.isLoading ? <h1>Enviando...</h1> : null}
        <button type="submit" className="btn btn-success mt-3">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Feed;
