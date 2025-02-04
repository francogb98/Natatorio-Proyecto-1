import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import CardActivity from "./CardActivity";

function PageActividades() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  return (
    <ul className="list-group list-group-flush">
      <h2 className="text-center mt-2">Informacion Actividades Usuario</h2>
      {user.activity?.length === 0 && (
        <div
          style={{
            height: "150px",
          }}
        >
          <p className="pt-4 h4 fw-normal">
            No estas registrado en ninguna actividad.
          </p>
        </div>
      )}
      {user.activity?.map((activity, i) => (
        <li key={activity._id} className="list-group-item p-2 p-md-5">
          <CardActivity activity={activity} status={user.status} i={i} />
        </li>
      ))}
    </ul>
  );
}

export { PageActividades };
