import PropTypes from "prop-types";

function Loading({ children }) {
  return (
    <div
      className="alert alert-primary text-center"
      role="alert"
      style={{
        //que aparezca fijo arriba
        position: "sticky",
        top: "0",
        zIndex: "1",
      }}
    >
      {children}
      <img
        src="https://media3.giphy.com/media/huOej08UYQYtAjH22E/giphy.gif?cid=ecf05e4722zlimap43nxwgs1uw1zfah471tybh9f7d5c2iap&amp;ep=v1_gifs_related&amp;rid=giphy.gif&amp;ct=s"
        // alt="Water Swimming Sticker by MySwimPro"
        // style="width: 500px; height: 281.25px; left: 0px; top: 0px;"
        style={{
          width: "60%",
        }}
      />
    </div>
  );
}

Loading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Loading;
