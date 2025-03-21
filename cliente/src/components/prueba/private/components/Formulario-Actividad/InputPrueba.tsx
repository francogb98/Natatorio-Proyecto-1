import React from "react";

interface InputPruebaProps {
  type?: string;
  name: string;
  placeholder: string;
  label: string;
  defaultValue?: string | number;
}

function InputPrueba({
  name,
  placeholder,
  type = "text",
  label,
  defaultValue,
}: InputPruebaProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="form-control"
        defaultValue={defaultValue}
      />
    </div>
  );
}

export { InputPrueba };
