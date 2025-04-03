import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { UserFetch } from "../../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

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
      className={`notification-card ${notificacion.leido ? "read" : "unread"}`}
      onClick={toggleBody}
    >
      <div className="notification-header">
        <div className="notification-status">
          {!notificacion.leido && <span className="unread-badge">Nuevo</span>}
        </div>
        <div className="notification-title">
          <h4>{notificacion.asunto}</h4>
          <span className="notification-time">{notificacion.fecha}</span>
        </div>
        <button
          className={`notification-toggle ${isExpanded ? "expanded" : ""}`}
          aria-expanded={isExpanded}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="notification-content"
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : "0",
        }}
      >
        <div className="notification-body">
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
