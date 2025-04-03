import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import CardNotificacion from "./CardNotificacion";
import "./style.css";

export function PageNotificaciones() {
  const {
    auth: { user },
    userRefetch,
  } = useContext(AuthContext);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notificaciones</h2>
        <span className="badge">{user.notificaciones?.length || 0}</span>
      </div>

      {user.notificaciones?.length === 0 ? (
        <div className="empty-notifications">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 01-3.46 0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        <div className="notifications-list">
          {user.notificaciones
            ?.slice()
            .reverse()
            .map((notificacion) => (
              <CardNotificacion
                key={notificacion._id}
                notificacion={notificacion}
                userRefetch={userRefetch}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
}
