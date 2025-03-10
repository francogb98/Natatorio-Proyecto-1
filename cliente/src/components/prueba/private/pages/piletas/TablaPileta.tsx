import PopoverButton from "../../utils/Popover";
import { User } from "../../../models";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface TablaPiletaProps {
  users: User[];
}

function TablaPileta({ users }: TablaPiletaProps) {
  //filtra cada 10 usuarios
  const [page, setPage] = useState(1);

  const usersPage = users.slice((page - 1) * 10, page * 10);

  const handlePrev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };
  const handleNext = () => {
    if (page === Math.ceil(users.length / 10)) return;
    setPage(page + 1);
  };

  return (
    <>
      {users.length > 10 && (
        <nav className="d-flex justify-content-between my-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handlePrev}
          >
            Pagina Anterior
          </button>
          <div className="fs-5">
            <span className="text-danger me-1">{page}</span>/{" "}
            {Math.ceil(users.length / 10)}
          </div>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleNext}
          >
            Pagina Siguiente
          </button>
        </nav>
      )}
      <table className="table table-striped table-hover table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Actividad</th>
            <th scope="col">Salida</th>
          </tr>
        </thead>
        <tbody>
          {usersPage.map((user: User) => (
            <tr key={user._id} style={{ cursor: "pointer" }}>
              <th scope="row">
                <Link
                  to={`/usuario/${user._id}`}
                  className="text-decoration-none"
                >
                  {user.customId}
                </Link>
              </th>
              <td>
                <PopoverButton user={user} />
              </td>
              <td>{user.activity[0].name}</td>
              <td>{user.activity[0].hourFinish}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TablaPileta;
