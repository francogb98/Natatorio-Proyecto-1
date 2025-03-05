import { useEffect } from "react";

const ImagenPerfil = ({ foto }) => {
  const optimizedUrl = foto.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_200,h_200,c_fill/"
  );

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = optimizedUrl;
    document.head.appendChild(link);
  }, [optimizedUrl]);

  return (
    <img
      src={optimizedUrl}
      className="card-img-top mb-2"
      style={{
        height: "200px",
        width: "200px",
      }}
      loading="lazy"
      alt="Foto de usuario"
    />
  );
};

export default ImagenPerfil;
