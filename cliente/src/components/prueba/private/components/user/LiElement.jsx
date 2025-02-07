import React, { useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";

function LiElement({ archivo, label }) {
  const { setImageModal } = useContext(AuthContext);

  return (
    <li className="list-group-item">
      <a
        className="fw-bold"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#modalArchivos"
        onClick={() => {
          setImageModal(archivo);
        }}
      >
        {label}
      </a>
    </li>
  );
}

export default LiElement;
