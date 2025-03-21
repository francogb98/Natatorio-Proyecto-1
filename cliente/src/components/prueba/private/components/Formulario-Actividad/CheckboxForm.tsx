import React, { useState } from "react";

interface CheckboxFormProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void; // Nueva prop
}

const CheckboxForm: React.FC<CheckboxFormProps> = ({
  checked,
  label,
  name,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(name, newChecked); // Enviar el nuevo estado al padre
  };

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        name={name}
        id={name} // Mejor usar `name` como `id` para evitar duplicados
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export { CheckboxForm };
