import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import CardNotificacion from "./CardNotificacion";

export function PageNotificaciones() {
  const {
    auth: { user },
    userRefetch,
  } = useContext(AuthContext);

  return (
    <div>
      {user.notificaciones?.length === 0 ? (
        <div>Usted Aun no tiene notificaciones</div>
      ) : (
        <div className="d-flex flex-column gap-3">
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
