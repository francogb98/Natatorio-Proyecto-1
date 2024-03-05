import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../../helpers/url";

function Habilitar() {
  const [page, setPage] = useState(1);

  const traerUsuarios = async () => {
    const res = await fetch(`${baseUrl}user/habilitar/${page}`, {
      method: "GET",
    });
    const data = await res.json();

    return data;
  };

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery(
    "usuarios",
    traerUsuarios
  );

  useEffect(() => {
    refetch();
  }, [page]);

  if (isLoading) {
    return (
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Cargando...
      </h1>
    );
  }

  if (data?.users) {
    console.log(Math.ceil(data.total / 20));
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>Todos los usuarios</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="fw-bold fs-5 text-warning">{data.total} Usuarios</div>
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end mt-2">
              {isRefetching && (
                <div
                  className="spinner-border text-primary mt-1 me-5"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              <li
                class={`page-item ${
                  page == 1 || isRefetching ? "disabled" : null
                }`}
              >
                <button
                  class="page-link ms-1"
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  Primera
                </button>
              </li>
              <li
                class={`page-item ${
                  page == 1 || isRefetching ? "disabled" : null
                }`}
              >
                <button
                  class="page-link"
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  Anterior
                </button>
              </li>
              <li class={`page-item mt-2 mx-2 fw-bold`}>
                <p>
                  {page} / {Math.ceil(data.total / 20)}
                </p>
              </li>

              <li
                class={`page-item ${
                  Math.ceil(data.total / 20) <= page || isRefetching
                    ? "disabled"
                    : null
                }`}
              >
                <button
                  class="page-link"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Siguiente
                </button>
              </li>
              <li
                class={`page-item ${
                  Math.ceil(data.total / 20) <= page || isRefetching
                    ? "disabled"
                    : null
                }`}
              >
                <button
                  class="page-link ms-1"
                  onClick={() => {
                    setPage(Math.ceil(data.total / 20));
                  }}
                >
                  Ultima
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "5px" }}>Id</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Nombre
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Actividad
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Habilitar
              </th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user._id}>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {user.customId}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  <Link to={`/admin/panel/usuario/${user._id}`}>
                    {user.nombre} {user.apellido}
                  </Link>
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {user.activity?.length ? user.activity[0].name : "No tiene"}
                </td>

                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to={`/admin/panel/usuario/${user._id}`}
                    className="btn btn-success"
                  >
                    Habilitar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-end mt-2">
            {isRefetching && (
              <div
                className="spinner-border text-primary mt-1 me-5"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            <li
              class={`page-item ${
                page == 1 || isRefetching ? "disabled" : null
              }`}
            >
              <button
                class="page-link ms-1"
                onClick={() => {
                  setPage(1);
                }}
              >
                Primera
              </button>
            </li>
            <li
              class={`page-item ${
                page == 1 || isRefetching ? "disabled" : null
              }`}
            >
              <button
                class="page-link"
                onClick={() => {
                  setPage(page - 1);
                }}
              >
                Anterior
              </button>
            </li>
            <li class={`page-item mt-2 mx-2 fw-bold`}>
              <p>
                {page} / {Math.ceil(data.total / 20)}
              </p>
            </li>

            <li
              class={`page-item ${
                Math.ceil(data.total / 20) <= page || isRefetching
                  ? "disabled"
                  : null
              }`}
            >
              <button
                class="page-link"
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Siguiente
              </button>
            </li>
            <li
              class={`page-item ${
                Math.ceil(data.total / 20) <= page || isRefetching
                  ? "disabled"
                  : null
              }`}
            >
              <button
                class="page-link ms-1"
                onClick={() => {
                  setPage(Math.ceil(data.total / 20));
                }}
              >
                Ultima
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Habilitar;
