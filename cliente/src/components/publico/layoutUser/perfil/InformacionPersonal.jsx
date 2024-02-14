import style from "./style.module.css";

function InformacionPersonal({
  formValues,
  handleInputChange,
  edicionActiva,
  setEdicionActiva,
  handleSubmitAdulto,
  setFormValues,
}) {
  return (
    <>
      <form action="">
        <div className={style.info}>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              e.preventDefault();
              setEdicionActiva(!edicionActiva);
            }}
          >
            {edicionActiva ? (
              "Cancelar"
            ) : (
              <div className="text-light">
                Editar <i className="bi bi-pencil ms-2"></i>
              </div>
            )}
          </button>
          {edicionActiva && (
            <button className="btn btn-success" onClick={handleSubmitAdulto}>
              Guardar
            </button>
          )}
        </div>

        <div className={style.info}>
          <label htmlFor="">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formValues.apellido}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className="mt-3">
          <div className={style.info}>
            <label htmlFor="no" className="ms-1">
              Natacion Convencional
            </label>
            <input
              type="radio"
              name="natacionAdaptada"
              checked={!formValues.natacionAdaptada}
              id="no"
              value="no"
              onChange={() => {
                setFormValues({
                  ...formValues,
                  natacionAdaptada: false,
                });
              }}
              disabled={!edicionActiva}
            />
          </div>
          <div className={style.info}>
            <label htmlFor="si" className="ms-1">
              Natacion Adaptada
            </label>
            <input
              type="radio"
              name="natacionAdaptada"
              checked={formValues.natacionAdaptada}
              id="si"
              value="si"
              onChange={() => {
                setFormValues({
                  ...formValues,
                  natacionAdaptada: true,
                });
              }}
              disabled={!edicionActiva}
            />
          </div>
        </div>

        <div className={style.info}>
          <label htmlFor="">Telefono</label>
          <input
            type="text"
            name="telefono"
            value={formValues.telefono}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>
        <div className={style.info}>
          <label htmlFor="">Telefono de emergencia</label>
          <input
            type="text"
            name="telefonoContacto"
            value={formValues.telefonoContacto}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control "
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={formValues.ciudad}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Barrio</label>
          <input
            type="text"
            name="barrio"
            value={formValues.barrio}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">Edad</label>
          <input
            type="number"
            name="edad"
            value={formValues.edad}
            onChange={handleInputChange}
            disabled={!edicionActiva}
            className="form-control"
          />
        </div>

        <div className={style.info}>
          <label htmlFor="">DNI</label>
          <input
            type="number"
            name="dni"
            value={formValues.dni}
            onChange={handleInputChange}
            className="form-control"
            disabled={!edicionActiva}
          />
        </div>
      </form>
    </>
  );
}

export default InformacionPersonal;
