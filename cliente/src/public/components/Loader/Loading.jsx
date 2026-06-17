import PropTypes from "prop-types";

function Loading({ children }) {
  return (
    <div
      className="alert alert-primary text-center"
      role="alert"
      style={{
        position: "sticky",
        top: "0",
        zIndex: "1",
      }}
    >
      {children}
      <div className="spinner-border text-primary mt-2" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}

Loading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Loading;
