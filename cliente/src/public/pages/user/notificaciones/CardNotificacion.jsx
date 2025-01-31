import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { UserFetch } from "../../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

import "./style.css";

const NotificacionCard = ({ notificacion, userRefetch, user }) => {
  const mutation = useMutation(UserFetch.updateNotificacion, {
    onSuccess: () => {
      userRefetch();
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleBody = () => {
    setIsExpanded((prev) => !prev);
    if (!notificacion.leido) {
      mutation.mutate({
        idNotificacion: notificacion._id,
        userId: user._id,
      });
    }
  };

  return (
    <div
      className={`card ${
        notificacion.leido ? "notificacion-leida" : "notificacion-no-leida"
      }`}
      style={{
        border: `2px solid ${notificacion.leido ? "#28a745" : "#dc3545"}`, // Verde o rojo
        borderLeft: `5px solid ${notificacion.leido ? "#28a745" : "#dc3545"}`, // Verde o rojo
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column gap-1">
          <div>{notificacion.asunto}</div>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            {notificacion.fecha}
          </div>
        </div>
        <button
          onClick={toggleBody}
          className="btn btn-link"
          style={{ textDecoration: "none" }}
        >
          {isExpanded ? "Ocultar" : "Ver más"}
        </button>
      </div>
      <div
        className="card-body-container"
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : "0",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <div ref={contentRef} className="card-body cuerpo">
          <p>{notificacion.cuerpo}</p>
        </div>
      </div>
    </div>
  );
};
NotificacionCard.propTypes = {
  notificacion: PropTypes.shape({
    asunto: PropTypes.string.isRequired,
    cuerpo: PropTypes.string.isRequired,
    fecha: PropTypes.string,
    leido: PropTypes.bool,
  }).isRequired,
};

export default NotificacionCard;
