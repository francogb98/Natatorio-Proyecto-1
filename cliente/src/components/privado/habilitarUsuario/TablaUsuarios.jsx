import React from "react";
import { useMutation } from "react-query";
import { sendEmailConfirmActivity } from "../../../helpers/sendEmail";
import Swal from "sweetalert2";
import { baseUrl } from "../../../helpers/url";

const habilitar = async ({ id }) => {
  const res = await fetch(baseUrl + "user/habilitar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return data;
};

function TablaUsuarios({ data, getUserById, refetch }) {
  if (!data) {
    return <div>No hay usuarios para habilitar</div>;
  }

  const mutation = useMutation({
    mutationFn: habilitar,
    onError: (error) => {
      console.log(error);
    },
  });

  if (mutation.isSuccess) {
    if (mutation.data.status === "success") {
      sendEmailConfirmActivity(mutation.data.data);
      Swal.fire({
        title: mutation.data.status.toUpperCase(),
        text: "Se ha enviado un correo de confirmacion al email del usuario",
        icon: mutation.data.status,
        confirmButtonText: "Aceptar",
      });

      return true;
    } else {
      Swal.fire({
        title: mutation.data.status.toUpperCase(),
        text: mutation.data.message,
        icon: mutation.data.status,
        confirmButtonText: "Aceptar",
      });
    }
    refetch();
  }

  const handleSearch = (id) => {
    getUserById.mutate({ id });
  };

  const handleHabilitar = (id) => {
    mutation.mutate({ id });
  };
  return (
    <div>
      <h1>Usuarios</h1>
      <table className="table table-striped-columns table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>

            <th>Actividad</th>
            <th>Dias</th>
            <th>Horario</th>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((usuario) => (
            <tr key={usuario._id} style={{ cursor: "pointer" }}>
              <td>{usuario.customId}</td>
              <td onClick={() => handleSearch(usuario.customId)}>
                {usuario.nombre}
              </td>

              <td>{usuario.activity[0].name}</td>
              <td>{usuario.activity[0].date.join("-")}</td>
              <td>
                {usuario.activity[0].hourStart} -{" "}
                {usuario.activity[0].hourFinish}
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleHabilitar(usuario._id)}
                >
                  Habilitar
                </button>
                <button className="btn btn-danger">No Habilitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
