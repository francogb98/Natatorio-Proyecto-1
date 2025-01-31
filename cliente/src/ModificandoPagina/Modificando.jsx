import Logo from "../assets/Logo.png";

function Modificando() {
  return (
    <div
      className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        background: "lightblue",
      }}
    >
      <div
        className="w-100 d-flex justify-content-center"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "10px",
        }}
      >
        <img
          src={Logo}
          alt="logo"
          style={{
            height: "100px",
            width: "auto",
          }}
        />
      </div>
      <div className="text-center">
        <h1 className="mb-4 text-dark">Estamos Actualizando la página</h1>
        <div className="mb-4">
          <img
            src="https://media3.giphy.com/media/huOej08UYQYtAjH22E/giphy.gif?cid=ecf05e4722zlimap43nxwgs1uw1zfah471tybh9f7d5c2iap&amp;ep=v1_gifs_related&amp;rid=giphy.gif&amp;ct=s"
            // alt="Water Swimming Sticker by MySwimPro"
            // style="width: 500px; height: 281.25px; left: 0px; top: 0px;"
            style={{
              width: "60%",
            }}
          />
        </div>
        <p className="lead text-secondary">
          Estamos trabajando para mejorar tu experiencia. Disculpa las
          molestias, estaremos de vuelta pronto.
        </p>
      </div>
    </div>
  );
}

export default Modificando;
