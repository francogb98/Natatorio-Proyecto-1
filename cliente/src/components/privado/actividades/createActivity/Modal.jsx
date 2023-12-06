function Modal({ args, createActivity }) {
  return (
    <div
      className="modal fade"
      id="modalCreateActivity"
      tabIndex="-1"
      aria-labelledby="modalCreateActivityLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="modalCreateActivityLabel">
              Modal title
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h3>Actividad Nueva</h3>

            <p>Nombre: {args.name}</p>
            <p>Dias: {args.date.join(" - ")}</p>
            <p>Hora de inicio: {args.hourStart}</p>
            <p>Hora de finalizacion: {args.hourFinish}</p>
            <p>Pileta: {args.pileta}</p>
            <p>Cupos: {args.cupos}</p>
            <p>Actividad Especial: {args.actividadEspecial ? "Si" : "No"}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() => createActivity.mutate(args)}
            >
              Crear
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
