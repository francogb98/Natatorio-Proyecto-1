import { set } from "lodash";
import React, { useEffect, useState } from "react";

function TablaAllUsers({
  data,
  editRole,
  setEditRole,
  suspender,
  setSuspender,
  handleChange,
  getUserById,
}) {
  const [usuarios, setUsuario] = useState(data);

  useEffect(() => {
    setUsuario(data);
  }, [data]);

  const orderByRole = (role) => {
    const sortedUsers = [...data].sort((a, b) => {
      if (a.role < b.role) return -1;
      if (a.role > b.role) return 1;
      return 0;
    });

    setUsuario(sortedUsers);
  };

  const orderById = () => {
    const sortedUsersById = [...data].sort((a, b) => a.customId - b.customId);

    setUsuario(sortedUsersById);
  };

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th onClick={() => orderById()} style={{ cursor: "pointer" }}>
            Id
          </th>
          <th>Nombre</th>
          <th onClick={() => orderByRole()} style={{ cursor: "pointer" }}>
            Rol
          </th>
          <th>Actividad</th>
          <th>Horario</th>
          <th>Dias</th>
          <th>Asistencia</th>

          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((user) => (
          <tr
            key={user.customId}
            className={
              editRole.id == user.customId || suspender.id === user.customId
                ? "table-danger"
                : null
            }
          >
            <td>{user.customId}</td>
            <td style={{ cursor: "pointer" }}>
              <a
                className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                onClick={() => getUserById.mutate({ id: user.customId })}
              >
                {user.nombre}
              </a>
            </td>
            {
              // si el editrol es tru y elid es igual al custom id poner un select con los roles
              // si el editrol es false y el id es igual al custom id poner el rol

              editRole.id === user.customId && editRole.status ? (
                <td>
                  <select
                    onChange={(e) => {
                      setEditRole({
                        ...editRole,
                        role: e.target.value,
                      });
                    }}
                    style={{ width: "90px" }}
                  >
                    <option value={null}>-- seleccione rol --</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super_admin</option>
                    <option value="Usuario">Usuario</option>
                  </select>
                </td>
              ) : (
                <td
                  className={
                    user.role == "suspendido" ? "text-danger fw-bold" : null
                  }
                >
                  {user.role == "usuario" || user.role == null
                    ? "null"
                    : user.role}
                </td>
              )
            }

            <td>
              {user.activity.length
                ? user.activity[0].name
                : user.status === false
                ? "esperando autorizacion"
                : " no se encuentra registrado"}
            </td>
            <td>
              {user.activity.length
                ? `${user.activity[0].hourStart} - ${user.activity[0].hourFinish}`
                : " - "}
            </td>
            <td>
              {user.activity.length ? user.activity[0].date.join("-") : " - "}
            </td>
            <td>
              {user.asistencia
                ? user.asistencia
                : "no tiene asistencias registradas"}
            </td>

            {user.role === null ? null : (
              <td>
                {(editRole.status || suspender.status) &&
                (editRole.id === user.customId ||
                  suspender.id === user.customId) ? (
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        handleChange(user);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setEditRole({
                          id: "",
                          status: false,
                        });
                        setSuspender({
                          id: "",
                          status: false,
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        setEditRole({
                          id: user.customId,
                          status: true,
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setSuspender({
                          id: user.customId,
                          status: true,
                        });
                      }}
                    >
                      Suspender
                    </button>
                  </div>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaAllUsers;
