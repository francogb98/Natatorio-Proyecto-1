import PopoverButton from "../../../utils/Popover";
import { User } from "../../../../models";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Table } from "react-bootstrap";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserClock,
  FaSwimmer,
} from "react-icons/fa";

interface TablaPiletaProps {
  users: User[];
}

function TablaPileta({ users }: TablaPiletaProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const usersPage = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);
  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(totalPages);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        {/* Paginación superior */}
        {users.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <div>
              <span className="text-muted">
                Mostrando {(page - 1) * itemsPerPage + 1}-
                {Math.min(page * itemsPerPage, users.length)} de {users.length}{" "}
                usuarios
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleFirst}
                disabled={page === 1}
              >
                <FaChevronLeft /> <FaChevronLeft />
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handlePrev}
                disabled={page === 1}
              >
                <FaChevronLeft />
              </Button>

              <div className="mx-2">
                <Badge bg="light" text="dark" className="fs-6">
                  {page} / {totalPages}
                </Badge>
              </div>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                <FaChevronRight />
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleLast}
                disabled={page === totalPages}
              >
                <FaChevronRight /> <FaChevronRight />
              </Button>
            </div>
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "35%" }}>Usuario</th>
                <th style={{ width: "30%" }}>Actividad</th>
                <th style={{ width: "25%" }}>Horario</th>
              </tr>
            </thead>
            <tbody>
              {usersPage.length > 0 ? (
                usersPage.map((user: User) => (
                  <tr key={user._id} className="align-middle">
                    <td>
                      <Link
                        to={`/usuario/${user._id}`}
                        className="text-decoration-none fw-semibold text-primary"
                      >
                        {user.customId}
                      </Link>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <PopoverButton user={user} />
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="text-white">
                        {user.activity[0]?.name || "Sin actividad"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FaUserClock className="text-muted" />
                        <span className="text-nowrap">
                          {user.activity[0]?.hourFinish || "--:--"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaSwimmer size={32} className="mb-2" />
                      <span>No hay usuarios registrados</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginación inferior */}
        {users.length > itemsPerPage && (
          <div className="d-flex justify-content-center p-3 border-top">
            <nav aria-label="Paginación">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handleFirst}>
                    <FaChevronLeft /> <FaChevronLeft />
                  </button>
                </li>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handlePrev}>
                    <FaChevronLeft />
                  </button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        page === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleNext}>
                    <FaChevronRight />
                  </button>
                </li>
                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleLast}>
                    <FaChevronRight /> <FaChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default TablaPileta;
