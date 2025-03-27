import React, { useEffect, useRef } from "react";
import { Popover } from "bootstrap";
import { User } from "../../models";
import {
  FaSwimmer,
  FaPhone,
  FaPhoneAlt,
  FaIdCard,
  FaBirthdayCake,
  FaInfoCircle,
} from "react-icons/fa";

interface PopoverProps {
  user: User;
}

const PopoverButton = ({ user }: PopoverProps) => {
  const buttonRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const popover = new Popover(buttonRef.current, {
        trigger: "hover",
        placement: "right",
        html: true,
        sanitize: false,
      });

      return () => {
        popover.dispose();
      };
    }
  }, []);

  const getAdaptiveBadge = () => {
    return user.natacionAdaptada
      ? '<span class="badge bg-success"><FaSwimmer /> Adaptada</span>'
      : "";
  };

  const popoverContent = `
    <div class="popover-custom" style="max-width: 300px;">
      <div class="popover-header bg-primary text-white d-flex align-items-center">
        <div class="flex-grow-1">
          <h6 class="mb-0">${user.nombre} ${user.apellido}</h6>
          <small class="text-white-50">ID: ${user.customId}</small>
        </div>
        ${getAdaptiveBadge()}
      </div>
      <div class="popover-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex align-items-center">
            <span class="icon-container text-primary me-2">
              <FaIdCard />
            </span>
            <div>
              <small class="text-muted">DNI</small>
              <div>${user.dni || "No especificado"}</div>
            </div>
          </li>
          <li class="list-group-item d-flex align-items-center">
            <span class="icon-container text-primary me-2">
              <FaBirthdayCake />
            </span>
            <div>
              <small class="text-muted">Edad</small>
              <div>${user.edad || "--"} años</div>
            </div>
          </li>
          <li class="list-group-item d-flex align-items-center">
            <span class="icon-container text-primary me-2">
              <FaPhoneAlt />
            </span>
            <div>
              <small class="text-muted">Teléfono</small>
              <div>${user.telefono || "No especificado"}</div>
            </div>
          </li>
          <li class="list-group-item d-flex align-items-center">
            <span class="icon-container text-primary me-2">
              <FaPhone />
            </span>
            <div>
              <small class="text-muted">Contacto de emergencia</small>
              <div>${user.telefonoContacto || "No especificado"}</div>
            </div>
          </li>
         
        </ul>
      </div>
    </div>
  `;

  return (
    <span
      ref={buttonRef}
      className="user-name-link"
      data-bs-toggle="popover"
      data-bs-placement="right"
      data-bs-html="true"
      data-bs-content={popoverContent}
      style={{ cursor: "pointer" }}
    >
      {user.nombre} {user.apellido}
    </span>
  );
};

export default PopoverButton;
