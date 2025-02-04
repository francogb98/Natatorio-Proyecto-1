import style from "./style.module.css";

function HelpButton({ openModal }) {
  return (
    <button
      type="button"
      className={`${style.btn__help}`}
      style={{
        left: "auto",
        marginRight: "15px",
      }}
      onClick={openModal}
    >
      <i
        className="bi bi-question-octagon"
        style={{
          fontSize: "30px",
        }}
      ></i>
    </button>
  );
}

export default HelpButton;
