import React from "react";
import { Stadistic } from "../../../../../../components/prueba/models";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface StadisticsProps {
  stadistics: Stadistic[];
}

const StadisticsTable: React.FC<StadisticsProps> = ({ stadistics }) => {
  if (!stadistics || stadistics.length === 0) {
    return (
      <div className="alert alert-info mt-4">
        No hay estadísticas disponibles para esta actividad
      </div>
    );
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Estadísticas de Asistencia</h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Días con actividad</th>
                <th>Total de asistencias</th>
                <th>Promedio diario</th>
              </tr>
            </thead>
            <tbody>
              {stadistics.map((stat) => {
                const tooltipId = `days-tooltip-${stat._id}`;
                return (
                  <tr key={stat._id}>
                    <td>
                      <strong>{stat.mes}</strong>
                    </td>
                    <td>
                      <span
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={stat.dias.join(", ")}
                        className="d-inline-block cursor-pointer"
                      >
                        {stat.dias.length} días
                        <i className="bi bi-info-circle ms-2"></i>
                      </span>
                      <Tooltip
                        id={tooltipId}
                        place="right"
                        className="custom-tooltip"
                      />
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {stat.usersQuantity} asistencias
                      </span>
                    </td>
                    <td>
                      {Math.round(stat.usersQuantity / stat.dias.length)} por
                      día
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen general (se mantiene igual) */}
        <div className="mt-3">
          <h5>Resumen General</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="card bg-light mb-3">
                <div className="card-body">
                  <h6 className="card-title">Total de meses registrados</h6>
                  <p className="card-text display-6">{stadistics.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-3">
                <div className="card-body">
                  <h6 className="card-title">Total de asistencias</h6>
                  <p className="card-text display-6">
                    {stadistics.reduce(
                      (acc, curr) => acc + curr.usersQuantity,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-3">
                <div className="card-body">
                  <h6 className="card-title">Promedio mensual de Usuarios</h6>
                  <p className="card-text display-6">
                    {Math.round(
                      stadistics.reduce(
                        (acc, curr) => acc + curr.usersQuantity,
                        0
                      ) / stadistics.length
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para el tooltip */}
      <style>{`
        .custom-tooltip {
          max-width: 300px;
          background-color: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default StadisticsTable;
