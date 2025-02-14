import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../helpers/url";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UserCard from "../../components/user/UserCard";
import UsersScheleton from "./UsersScheleton";
import Pagination from "../../components/user/Pagination";

const traerUsuarios = async (filtro) => {
  const res = await fetch(`${baseUrl}user/${filtro}`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};

function UserList() {
  const { filtro } = useParams();
  const [page, setPage] = useState(1); // Estado para la página actual
  const usersPerPage = 12; // Número de usuarios por página

  const users = useQuery({
    queryKey: ["users-list", filtro],
    queryFn: () => traerUsuarios(filtro),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    users.refetch();
    setPage(1);
  }, [filtro]);

  if (users.isFetching) {
    return <UsersScheleton />;
  }

  if (users.isSuccess && users.data) {
    if (!users.data.users) {
      return <h1 className="text-center mt-5">No se encontraron usuarios</h1>;
    }

    const totalUsers = users.data.users.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage); // Calcular el número total de páginas

    // Obtener los usuarios de la página actual
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = users.data.users.slice(startIndex, endIndex);

    return (
      <div className="row mt-3 justify-content-around g-1">
        <div className="d-flex justify-content-center">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>

        {currentUsers.map((user) => (
          <div key={user._id} className="col-6 col-lg-4 col-xl-3 p-3">
            <UserCard user={user} />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
    );
  }
}

export default UserList;
