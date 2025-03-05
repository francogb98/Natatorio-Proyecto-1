import React, { useEffect, useRef } from "react";

import { Popover } from "bootstrap";
import { User } from "../../models";

interface PopoverProps {
  user: User;
}

const PopoverButton = ({ user }: PopoverProps) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      new Popover(buttonRef.current, {
        trigger: "hover", // Activa el popover cuando se pasa el mouse
        placement: "right", // Ubicación del popover
        html: true, // Permitir contenido HTML dentro del popover
      });
    }
  }, []);

  return (
    <span
      ref={buttonRef}
      data-bs-toggle="popover"
      data-bs-placement="right"
      data-bs-html="true"
      data-bs-content={`
        <div class="card" style="width: 18rem;">
        <h5 class="text-center">Informacion Usuario</h5>
            <div class="card-body">
                <p><b>Natacion Adaptada </b>: ${
                  user.natacionAdaptada ? "Si" : "No"
                }</p>
                <p><b>Edad </b>: ${user.edad}</p>
                <p><b>Dni </b>: ${user.dni}</p>
                <p><b>Telefono </b>: ${user.telefono}</p>
                <p><b>Telefono de Emergencia</b>: ${user.telefonoContacto}</p>
            </div>
        </div>      
        `}
    >
      {user.nombre} {user.apellido}
    </span>
  );
};

export default PopoverButton;
