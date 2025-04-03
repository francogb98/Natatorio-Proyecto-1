import PropTypes from "prop-types";

function InputCustom({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  errores,
  className = "",
  required = false,
}) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value || ""}
        placeholder={placeholder}
        className={`form-control ${errores ? "is-invalid" : ""}`}
        onChange={onChange}
        required={required}
      />
      {errores && <div className="invalid-feedback d-block">{errores}</div>}
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
  className: PropTypes.string,
  required: PropTypes.bool,
};

export default InputCustom;
