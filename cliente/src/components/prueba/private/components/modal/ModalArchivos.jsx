function ModalArchivos() {
  return (
    <div
      className="modal fade"
      id="modalArchivosPrivate"
      tabIndex="-1"
      aria-labelledby="modalArchivosPrivateLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content position-relative">
          {/* Botón de cierre en la esquina superior derecha */}
          <button
            type="button"
            className="btn-close position-absolute"
            data-bs-dismiss="modal"
            aria-label="Close"
            style={{
              top: "10px",
              right: "10px",
              zIndex: 10, // Asegura que esté por encima de la imagen
              backgroundColor: "rgba(250, 250, 250, 0.5)", // Fondo oscuro para mejor visibilidad
              borderRadius: "50%", // Forma redonda
              padding: "10px",
            }}
          ></button>

          {/* Imagen */}
          <div className="modal-body p-0">
            {imageModal && (
              <img
                src={imageModal}
                alt="Imagen Modal"
                className="w-100"
                style={{ height: "80vh" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ModalArchivos };
