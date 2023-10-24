import React from "react";

function TablaUsuariosEspeciales({ info, getUserById }) {
  const { usersRegistered } = info.users;
  return (
    <div>
      <h3>
        {info.nombreActividad.charAt(0).toUpperCase() +
          info.nombreActividad.slice(1)}
      </h3>
      <div
        className="mt-3"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5>{info.pileta.charAt(0).toUpperCase() + info.pileta.slice(1)}</h5>
        <h5>
          Total:
          <span className="text-danger">{info.users.length}</span>
        </h5>
      </div>
      {/* crear una tabla */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Usuario</th>
          </tr>
        </thead>

        <tbody>
          {usersRegistered &&
            usersRegistered.length > 0 &&
            usersRegistered.map((user, id) => (
              <tr key={id} style={{ cursor: "pointer" }}>
                <td>{user.customId}</td>
                <td style={{ cursor: "pointer" }}>
                  <a
                    className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    onClick={() => getUserById.mutate({ id: user.customId })}
                  >
                    {user.nombre}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuariosEspeciales;
