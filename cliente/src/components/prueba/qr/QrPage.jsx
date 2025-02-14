import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation } from "react-query";
import { QrFetch } from "../../../helpers/qr";

const QrPage = () => {
  const [text, setText] = useState(null);

  const generarFecha = useMutation({
    mutationFn: QrFetch.generarFecha,
    onSuccess: ({ data }) => {
      setText(data);
    },
  });

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => generarFecha.mutate()}
        >
          Generar Qr
        </button>

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
