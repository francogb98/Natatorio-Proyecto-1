import React, { useState, useCallback, useEffect } from "react";
import ImageViewer from "react-simple-image-viewer";

import style from "./style.module.css";

const UserImages = ({ imagen, setView, setImagen }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoom = (e) => {
    // Detecta la dirección del desplazamiento de la rueda del ratón
    const zoomDirection = e.deltaY > 0 ? -0.1 : 0.1; // Ajusta el valor según tu preferencia de zoom

    // Calcula el nuevo nivel de zoom
    const newZoomLevel = Math.max(0.1, Math.min(zoomLevel + zoomDirection, 3)); // Limita el zoom a un rango de 0.1 a 3

    // Actualiza el estado del nivel de zoom

    if (newZoomLevel < 4) {
      setZoomLevel(newZoomLevel);
    }
  };

  return (
    <div className="col-6 d-flex flex-wrap gap-3 fw-bold text-center">
      <div className={style.imagenFondo} onWheel={handleZoom}>
        <img
          className={style.imagen}
          src={imagen}
          style={{ transform: `scale(${zoomLevel})` }} // Aplica el nivel de zoom a la imagen mediante transform
          alt="Imagen"
        />
        <button
          className={`btn btn-lg btn-warning ${style.button}`}
          onClick={() => {
            setView(false);
            setImagen(null);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default UserImages;
