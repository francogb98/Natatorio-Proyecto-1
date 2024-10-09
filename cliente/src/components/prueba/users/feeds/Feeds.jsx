import { useEffect, useState } from "react";
import { baseUrl } from "../../../../helpers/url";

import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";

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
    <div key={feed._id} className="col-9 my-3 mx-auto border p-4">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="d-flex justify-content-between">
          <p>
            <span className="fw-bold">Usuario: </span>
            {feed.user.nombre} {feed.user.apellido}
          </p>
          <p>
            <span className="fw-bold">ID usuario: </span>
            {feed.user.customId}
          </p>
        </div>
      </div>
      <div className="mb-3">
        {" "}
        <span className="fw-bold">Mensaje: </span>{" "}
        {feed.mensage ? feed.mensage : null}
      </div>

      {feed.contestado ? (
        <div className="text-success">
          Contestado <i className="bi bi-check"></i>
        </div>
      ) : (
        <form
          action=""
          onSubmit={handleSubmit}
          className="mt-2"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <textarea
            type="text"
            style={{
              width: "100%",
              height: "100px",
            }}
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
          />
          <button className="mt-2 btn btn-primary">Responder</button>
        </form>
      )}
    </div>
  );
}

function Feeds() {
  const [pagina, setPagina] = useState(1);

  const verFeeds = async () => {
    try {
      const resp = await fetch(baseUrl + `feedback/${pagina}`, {
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

  const queryClient = useQueryClient();
  const getFeeds = useQuery({
    queryKey: ["verFeeds"],
    queryFn: verFeeds,
  });

  useEffect(() => {
    getFeeds.refetch();
  }, [pagina]);

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

  // if (getFeeds.isRefetching) return <h1>Cargando</h1>;
  if (getFeeds.isLoading) return <h1>Cargando</h1>;
  if (getFeeds.isSuccess && !getFeeds.data) return <h1>Cargando</h1>;
  return (
    <>
      <div className="row">
        {getFeeds.data.feedbacks?.map((feed) => (
          <FeedbackItem
            key={feed._id}
            feed={feed}
            onSend={(data) => responderFeed.mutate(data)}
          />
        ))}
      </div>
    </>
  );
}

export { Feeds };
