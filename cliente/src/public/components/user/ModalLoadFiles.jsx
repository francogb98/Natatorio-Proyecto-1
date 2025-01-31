import FormLoadFiles from "./FormLoadFiles";

function ModalLoadFiles() {
  return (
    <div>
      <div
        className="modal fade"
        id="loadFileModal"
        tabIndex="-1"
        aria-labelledby="loadFileModalLabel"
        aria-hidden="true"
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
              <FormLoadFiles />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalLoadFiles;
