import PropTypes from "prop-types";

function InputCustom({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  errores,
}) {
  return (
    <div className="col-sm-6">
      <label
        htmlFor="nombre"
        style={{
          marginBottom: "10px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className="form-control"
        autoComplete="off"
        style={{
          marginTop: "-10px",
        }}
        onChange={onChange}
      />

      {errores ? (
        <div className="text-danger text-center fw-bold">{errores}</div>
      ) : null}
    </div>
  );
}
InputCustom.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errores: PropTypes.string,
};
export default InputCustom;
