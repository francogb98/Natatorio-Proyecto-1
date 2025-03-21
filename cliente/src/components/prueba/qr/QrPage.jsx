import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation } from "react-query";
import { QrFetch } from "../../../helpers/qr";
import { useNavigate } from "react-router-dom";

const QrPage = () => {
  const [text, setText] = useState(null);

  const navigate = useNavigate();

  const generarFecha = useMutation({
    mutationFn: QrFetch.generarFecha,
    onSuccess: ({ data }) => {
      setText(data);
    },
  });

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate("/dashboard")}
          >
            {/* icono de flechita para atras */}
            <i className="bi bi-arrow-left-short pt-3"></i>
            Volver
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => generarFecha.mutate()}
          >
            Generar Qr
          </button>
        </div>

        {generarFecha.isLoading && <h2>Cargando qr...</h2>}
      </div>

      {generarFecha.isSuccess && text && (
        <div className="d-flex flex-column align-items-center gap-2">
          <h3>Registra Tu Asistencia </h3>
          <QRCodeCanvas
            value={text}
            size={450}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
      )}
    </>
  );
};

export default QrPage;
