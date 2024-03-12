import React from "react";
import style from "./home.module.css";
import { useQuery } from "react-query";

import { info_tablas } from "./helpers/info_tablas.fetch";

function Footer() {
  const info_pileta = useQuery({
    queryKey: ["piletas"],
    queryFn: info_tablas,
  });

  if (info_pileta.isLoading) {
    return (
      <footer>
        <nav>
          <div>
            Turno actual:{" "}
            <p
              className="spinner-border text-primary  ms-1"
              style={{
                fontSize: "10px",
                height: "15px",
                width: "15px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </p>
          </div>
          <div>
            Usuarios pileta 25:{" "}
            <p
              className="spinner-border text-primary  ms-1"
              style={{
                fontSize: "10px",
                height: "15px",
                width: "15px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </p>
          </div>

          <div>
            Usuarios pileta 50:
            <p
              className="spinner-border text-primary  ms-1"
              style={{
                fontSize: "10px",
                height: "15px",
                width: "15px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </p>
          </div>
          <div>
            Usuarios turnoSiguiente:
            <p
              className="spinner-border text-primary ms-1"
              style={{
                fontSize: "10px",
                height: "15px",
                width: "15px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </p>
          </div>
        </nav>
      </footer>
    );
  }

  return (
    <nav>
      <ul className="nav justify-content-around bg-light">
        {info_pileta.data.resultado.map((data) => {
          if (data.pileta === "pileta 25") {
            return (
              <>
                <li className="nav-link">
                  Turno actual:{" "}
                  <span className="text-success"> {data.hora}</span>
                </li>
                <li className="nav-link">
                  Usuarios pileta 25:{" "}
                  <span className="text-danger"> {data.users.length}</span>
                </li>
              </>
            );
          }
          return (
            <li key={data._id} className="nav-link">
              Usuarios {data.pileta}:
              <span className="text-danger"> {data.users.length}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Footer;
