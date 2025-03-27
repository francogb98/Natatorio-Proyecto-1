import React from "react";
import { Toaster, toast } from "sonner";
import Funciones_administrador from "../hooks/Funciones_administrador";

function Acciones_mesa_entrada({ user }) {
  const { habilitar } = Funciones_administrador();

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary bg-opacity-10 border-0">
        <h3 className="mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-clipboard-check"></i>
          Acciones de Mesa de Entrada
        </h3>
      </div>

      <div className="card-body text-center">
        {user.activity?.length > 0 && (
          <div className="d-grid">
            <button
              className="btn btn-success btn-lg d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                toast.info("Habilitando usuario...");
                habilitar.mutate({ id: user._id });
              }}
            >
              <i className="bi bi-check-circle-fill"></i>
              Habilitar Usuario
            </button>

            <div className="mt-2 small text-muted">
              Esta acción permitirá al usuario acceder al sistema
            </div>
          </div>
        )}

        {!user.activity?.length && (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            El usuario no está asignado a ninguna actividad
          </div>
        )}
      </div>
      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default Acciones_mesa_entrada;
