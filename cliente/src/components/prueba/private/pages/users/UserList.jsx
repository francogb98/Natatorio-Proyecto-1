import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../helpers/url";
import { useEffect } from "react";
import { useQuery } from "react-query";
import UserCard from "../../components/user/UserCard";

const traerUsuarios = async (filtro) => {
  const res = await fetch(`${baseUrl}user/${filtro}`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};

function UserList() {
  const { filtro } = useParams();

  const users = useQuery({
    queryKey: ["users-list"],
    queryFn: () => traerUsuarios(filtro),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    users.refetch();
  }, [filtro]);

  if (users.isFetching) {
    return (
      <div className="row mt-3 justify-content-around g-1">
        {Array(12)
          .fill()
          .map((__, i) => (
            <div key={i} className="col-6 col-lg-4 col-xl-3 p-3">
              <div className="card" aria-hidden="true">
                <div
                  className="placeholder-glow"
                  style={{
                    width: "100%",
                    height: "200px",
                  }}
                >
                  {" "}
                </div>
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                  </p>
                  <a
                    className="btn btn-primary disabled placeholder col-6"
                    aria-disabled="true"
                  ></a>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
  if (users.isSuccess) {
    return (
      <div className="row mt-3 justify-content-around g-1">
        {users.data.users.map((user) => (
          <div key={user._id} className="col-6 col-lg-4 col-xl-3 p-3">
            <UserCard user={user} />
          </div>
        ))}
      </div>
    );
  }
}

export default UserList;
