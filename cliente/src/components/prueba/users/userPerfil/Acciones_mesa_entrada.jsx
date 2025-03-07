import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import Funciones_administrador, {
  getActividades,
} from "../hooks/Funciones_administrador";

function Acciones_mesa_entrada({ user }) {
  const [accion, setAccion] = useState("");
  const [ejecutarAccion, setEjecutarAccion] = useState(false);

  useEffect(() => {}, [accion, ejecutarAccion]);

  const { habilitar } = Funciones_administrador();

  return (
    <div className="row mb-4 border">
      <h2 className="text-center ">Acciones Administrador</h2>
      <div className="col-12">
        {user.activity?.length ? (
          <>
            <label className="fw-bold">Actividad:</label>
            <div className="d-flex justify-content-center mb-2">
              <button
                className="btn btn-lg btn-success"
                onClick={() => {
                  habilitar.mutate({ id: user._id });
                }}
              >
                Habilitar Usuario
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Acciones_mesa_entrada;
