import PropTypes from "prop-types";

function SkeletonLoader({ type = "default", lines = 3 }) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="card mb-3" aria-hidden="true">
            <div className="card-body">
              <div className="placeholder-glow">
                <span className="placeholder col-6 mb-2"></span>
                <span className="placeholder col-8"></span>
                <span className="placeholder col-4 mt-2"></span>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {[...Array(4)].map((_, i) => (
                    <th key={i}>
                      <span className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex}>
                        <span className="placeholder-glow">
                          <span className="placeholder col-8"></span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "text":
        return (
          <div className="placeholder-glow">
            {[...Array(lines)].map((_, i) => (
              <span key={i} className="placeholder me-2 mb-2" style={{ width: `${70 + Math.random() * 30}%` }}></span>
            ))}
          </div>
        );

      default:
        return (
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-3" role="status" aria-label="Cargando contenido">
      {renderSkeleton()}
    </div>
  );
}

SkeletonLoader.propTypes = {
  type: PropTypes.oneOf(["default", "card", "table", "text"]),
  lines: PropTypes.number,
};

export default SkeletonLoader;
