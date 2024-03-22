import { useEffect, useState } from "react";
import { baseUrl } from "../../../helpers/url";

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
    <div
      key={feed._id}
      className="mb-2"
      style={{
        border: "1px solid black",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
        justifyContent: "space-between",
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
          <button className="mt-2 btn btn-primary">Enviar</button>
        </form>
      )}
    </div>
  );
}

function FeedBacks() {
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
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          marginBlock: "5px",
        }}
      >
        <ul className="pagination">
          <li className={`page-item ${pagina != 1 ? null : "disabled"}`}>
            <button
              className="page-link me-1"
              style={{
                fontSize: "16px",
              }}
              onClick={() => {
                setPagina(1);
              }}
            >
              Primera Pagina
            </button>
          </li>
          <li className={`page-item ${pagina != 1 ? null : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => {
                setPagina(pagina - 1);
              }}
            >
              Anterior
            </button>
          </li>
          <li className="page-item">
            <h5 className="mt-1 mx-3">{pagina}</h5>
          </li>
          <li
            className={`page-item ${
              getFeeds.data.feedbacks.length == 30 ? null : "disabled"
            }`}
          >
            <button
              className="page-link"
              href="#"
              onClick={() => {
                setPagina(pagina + 1);
              }}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "10px",
        }}
      >
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

export default FeedBacks;
