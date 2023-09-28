import React from "react";

function TablaUsuarios({ pileta25, pileta50, getUserById }) {
  return (
    <div style={{ paddingTop: "30px", paddingBottom: "30px" }}>
      <h1>Usuarios en pileta</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: "20px",
        }}
      >
        <div>
          <h3>pileta25</h3>
          <h4>
            Total: <span style={{ color: "red" }}>{pileta25.length}</span>
          </h4>
          <div style={{ overflow: "auto", height: "70vh" }}>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Actividad</th>
                </tr>
              </thead>
              <tbody>
                {pileta25.length > 0 &&
                  pileta25.map((user, id) => (
                    <tr key={id} style={{ cursor: "pointer" }}>
                      <td>{user.customId}</td>
                      <td style={{ cursor: "pointer" }}>
                        <a
                          className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                          onClick={() =>
                            getUserById.mutate({ id: user.customId })
                          }
                        >
                          {user.nombre}
                        </a>
                      </td>
                      <td>{user.activity[0].name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>pileta50</h3>
          <h4>
            Total: <span style={{ color: "red" }}>{pileta50.length}</span>
          </h4>
          <div style={{ overflow: "auto", height: "70vh" }}>
            <table className="table table-striped table-hover ">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Actividad</th>
                </tr>
              </thead>
              <tbody>
                {pileta50.length > 0 &&
                  pileta50
                    .slice() // Crear una copia del array para evitar modificar el original
                    .sort((userA, userB) =>
                      userA.activity[0].name.localeCompare(
                        userB.activity[0].name
                      )
                    )
                    .map((user, i) => (
                      <tr key={i} style={{ cursor: "pointer" }}>
                        <td>{user.customId}</td>
                        <td style={{ cursor: "pointer" }}>
                          <a
                            className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                            onClick={() =>
                              getUserById.mutate({ id: user.customId })
                            }
                          >
                            {user.nombre}
                          </a>
                        </td>
                        <td>{user.activity[0].name}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablaUsuarios;
