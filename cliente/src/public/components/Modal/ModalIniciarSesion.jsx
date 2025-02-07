import LoginForm from "../LoginForm";

function ModalIniciarSesion() {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body text-center">
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <LoginForm label="Iniciar sesion" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ModalIniciarSesion };
