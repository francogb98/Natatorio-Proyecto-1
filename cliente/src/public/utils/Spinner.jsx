function Spinner() {
  return (
    <div className="text-center mt-3">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Subiendo Archivo...</span>
      </div>
    </div>
  );
}

export default Spinner;
