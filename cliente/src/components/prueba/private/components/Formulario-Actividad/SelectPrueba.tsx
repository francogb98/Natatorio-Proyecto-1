import React from "react";

interface SelectPruebaProps {
  name: string;
  label: string;
  defaultOption: string;
  options: string[];
  defaultValue?: string;
  valueSelected?: string[];
  children?: React.ReactNode;
  setValueSelected?: React.Dispatch<React.SetStateAction<string[]>>;
}

function SelectPrueba({
  name,
  label,
  options,
  defaultOption,
  defaultValue,
  valueSelected,
  setValueSelected,
  children,
}: SelectPruebaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValueSelected &&
      !valueSelected?.includes(e.target.value) &&
      e.target.value !== "" &&
      setValueSelected((prev) => [...prev, e.target.value]);
  };

  return (
    <>
      <div>
        <label htmlFor={name} className="form-label">
          {label}
        </label>
        <select
          name={name}
          className="form-select"
          defaultValue={defaultValue}
          onChange={handleChange}
        >
          <option value="">{defaultOption}</option>
          {children
            ? children
            : options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
        </select>
      </div>

      {valueSelected && (
        <div className="d-flex justify-content-center mt-2 ">
          {valueSelected.map((value) => (
            <span key={value} className="badge bg-primary me-1 px-3 py-2">
              {value}
              <button
                className="btn-close btn-close-warning ms-1"
                onClick={() =>
                  setValueSelected &&
                  setValueSelected((prev) =>
                    prev.filter((prevValue) => prevValue !== value)
                  )
                }
              ></button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export { SelectPrueba };
