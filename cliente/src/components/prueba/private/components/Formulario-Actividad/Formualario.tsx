import React from "react";

interface FormualarioProps {
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
}

function Formualario({
  children,
  handleSubmit,
  placeholder,
}: FormualarioProps) {
  return (
    <>
      <h2 className="text-center">{placeholder}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="flex flex-col items-center"
      >
        {children}
      </form>
    </>
  );
}

export { Formualario };
