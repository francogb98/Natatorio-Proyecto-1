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
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <LoginForm label="Iniciar sesion" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ModalIniciarSesion };
