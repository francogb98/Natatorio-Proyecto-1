import { useEffect } from "react";

const ImagenUser = ({ foto }) => {
  const optimizedUrl = foto.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_100,h_100,c_fill/"
  );

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = optimizedUrl;
    document.head.appendChild(link);
  }, [optimizedUrl]);

  return (
    <div className="d-flex justify-content-center">
      <img
        src={optimizedUrl}
        className="card-img-top rounded-circle mb-2"
        style={{ width: "100px", height: "100px", margin: "0 auto" }}
        loading="lazy"
        alt="Foto de usuario"
      />
    </div>
  );
};

export default ImagenUser;
