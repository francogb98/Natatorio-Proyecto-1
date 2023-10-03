import React from "react";

function TableUsers({ userRegistered }) {
  return (
    <div>
      {userRegistered.length > 0 ? (
        <>
          <h1>Tabla de usuarios</h1>
          <table className="table table-striped" style={{ overflow: "auto" }}>
            <thead>
              <tr>
                <th>Nombre</th>

                <th>Id</th>
                <th>Actividad</th>
                <th>Pileta</th>
              </tr>
            </thead>
            <tbody>
              {userRegistered[0].map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.customId}</td>
                  <td>{user.activity ? user.activity[0].name : "-"}</td>
                  <td>{user.activity ? user.activity[0].pileta : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h4 style={{ paddingBlock: "100px" }}>No hay usuarios Registrados</h4>
      )}
    </div>
  );
}

export default TableUsers;
