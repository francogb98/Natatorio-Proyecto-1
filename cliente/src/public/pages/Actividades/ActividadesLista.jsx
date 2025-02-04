import PropTypes from "prop-types";

import { CardActividad } from "../../components/Actividades";

function ActividadesLista({ actividades }) {
  //TRAE TODAS LAS ACTIVIDADES

  return (
    <div className="row mt-3 justify-content-around g-1">
      {actividades.map((actividad) => (
        <div key={actividad._id} className="col-6 col-lg-3 p-3">
          <CardActividad actividad={actividad} />
        </div>
      ))}
    </div>
  );
}

ActividadesLista.propTypes = {
  actividades: PropTypes.array,
};
export default ActividadesLista;
