import SvgSearch from "../../utils/SvgSearch";
import PropTypes from "prop-types";

function FormSearch({ filtro, setFiltro }) {
  return (
    <form
      className="position-relative"
      data-bs-toggle="search"
      data-bs-display="static"
      aria-expanded="false"
    >
      <div className="d-flex align-items-center position-relative">
        <input
          className="form-control search-input fuzzy-search rounded-pill form-control-sm"
          type="string"
          placeholder="escuela de natacion, natacion infantil, etc."
          aria-label="Search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value.toLowerCase())}
          style={{
            height: "50px",
            paddingLeft: "20px",
          }}
        />
        {/* Icono de buscar / importado de utils */}
        <SvgSearch />
      </div>
    </form>
  );
}
FormSearch.propTypes = {
  filtro: PropTypes.string.isRequired,
  setFiltro: PropTypes.func.isRequired,
};

export { FormSearch };
