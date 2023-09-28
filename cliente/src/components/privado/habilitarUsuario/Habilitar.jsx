import { useQuery, useMutation } from "react-query";
import TablaUsuarios from "./TablaUsuarios";

import { getUser } from "../../../helpers/getInfoUser";

//traigo todos los usuarios para habilitar

import { getUsuarios } from "../../../helpers/getUsers";

import User from "../UserInfo/User";

function Habilitar() {
  const { data, isSuccess, status, isLoading, refetch, isRefetching } =
    useQuery({
      queryKey: ["usuarios"],
      queryFn: getUsuarios,
    });

  const getUserById = useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {},
    onError: (error) => {},
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (status === "error") {
    return <div>Error al obtener los usuarios</div>;
  }

  if (data.length === 0) {
    return <div>No hay usuarios para habilitar</div>;
  }

  if (getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <button
          onClick={refetch}
          className="btn btn-lg btn-warning mt-3 mb-3"
          style={{ width: "400px", margin: "auto", display: "block" }}
        >
          Recargar
        </button>

        {isRefetching ? (
          <div
            style={{ margin: "auto", display: "block", width: "fit-content" }}
          >
            <h3>Recargando...</h3>
          </div>
        ) : null}
      </div>

      {isSuccess && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "800px 1fr",
            padding: "50px",
            gap: "20px",
            marginTop: "-35px",
          }}
        >
          <TablaUsuarios
            data={data}
            getUserById={getUserById}
            refetch={refetch}
          />
        </div>
      )}
    </div>
  );
}

export default Habilitar;
