import { useState } from "react";
import { baseUrl } from "../../../helpers/url";

import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";

const verFeeds = async () => {
  try {
    const resp = await fetch(baseUrl + "user/verFeedbacks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
const responder = async (content) => {
  try {
    const resp = await fetch(baseUrl + "user/notificaciones/create", {
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

function FeedbackItem({ feed, onSend }) {
  const [cuerpo, setCuerpo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: feed.user._id,
      asunto: feed.mensage,
      idFeed: feed._id,
      cuerpo: cuerpo,
    };

    onSend(data);
  };

  return (
    <div
      key={feed._id}
      className="mb-2"
      style={{
        border: "1px solid black",
        padding: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p>
          Usuario: {feed.user.nombre} {feed.user.apellido}
        </p>
        <p>ID usuario: {feed.user.customId}</p>
      </div>
      <div>Mensaje: {feed.mensage ? feed.mensage : null}</div>

      {feed.contestado ? (
        <div className="text-success">
          Contestado <i class="bi bi-check"></i>
        </div>
      ) : (
        <form
          action=""
          onSubmit={handleSubmit}
          className="mt-2"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "40%",
          }}
        >
          <textarea
            type="text"
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
          />
          <button className="mt-2 btn btn-primary">Enviar</button>
        </form>
      )}
    </div>
  );
}

function FeedBacks() {
  const queryClient = useQueryClient();
  const getFeeds = useQuery({
    queryKey: ["verFeeds"],
    queryFn: verFeeds,
  });
  const responderFeed = useMutation({
    mutationKey: "verFeeds",
    mutationFn: responder,
    onSuccess: (data) => {
      queryClient.invalidateQueries("verFeeds");
      Swal.fire({
        icon: "success",
        title: "Respuesta enviada con exito",
        text: data.message,
      });
    },
  });

  if (getFeeds.isLoading) return <h1>Cargando</h1>;
  if (getFeeds.isSuccess && !getFeeds.data) return <h1>Cargando</h1>;
  return (
    <div>
      {getFeeds.data.feedbacks?.map((feed) => (
        <FeedbackItem
          key={feed._id}
          feed={feed}
          onSend={(data) => responderFeed.mutate(data)}
        />
      ))}
    </div>
  );
}

export default FeedBacks;
