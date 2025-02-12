import "./style.css";

function Pagination({ page, setPage, totalPages }) {
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Calcular el rango de páginas a mostrar
  const getPageRange = () => {
    let start = Math.max(1, page - 1); // Comenzar desde una página antes de la actual
    let end = Math.min(totalPages, page + 1); // Terminar en una página después de la actual

    // Asegurarse de que siempre se muestren 3 páginas
    if (end - start + 1 < 3) {
      if (start === 1) {
        end = Math.min(totalPages, start + 2);
      } else if (end === totalPages) {
        start = Math.max(1, end - 2);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePrevious}>
            Anterior
          </button>
        </li>
        {getPageRange().map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${page === pageNumber ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => setPage(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={handleNext}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
