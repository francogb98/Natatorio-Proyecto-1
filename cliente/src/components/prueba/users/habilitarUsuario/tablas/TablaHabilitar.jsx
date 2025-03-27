import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import {
  FaSearch,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

function TablaHabilitar({ data, columns, type }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const { auth, dispatch } = useContext(AuthContext);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  useEffect(() => {
    table.setPageIndex(auth.paginaHabilitar);
    return () => {
      dispatch({
        type: "SET_PAGINA_HABILITAR",
        payload: { paginaHabilitar: table.getState().pagination.pageIndex },
      });
    };
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        {/* Header con búsqueda */}
        <div className="p-3 border-bottom bg-light">
          <div className="row align-items-center">
            <div className="col-md-6 mb-2 mb-md-0">
              <h5 className="mb-0 text-primary">
                {type === "usuarios" ? "Usuarios" : "Actividades"} Habilitados
              </h5>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Buscar ${
                    type === "usuarios" ? "usuario" : "actividad"
                  }...`}
                  value={filtering}
                  onChange={(e) => setFiltering(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        cursor: "pointer",
                        minWidth: header.column.getSize(),
                      }}
                      className="align-middle"
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <i className="bi bi-caret-up-fill ms-2"></i>,
                          desc: <i className="bi bi-caret-down-fill ms-2"></i>,
                        }[header.column.getIsSorted()] ?? (
                          <i className="bi bi-caret-down-up ms-2 text-muted"></i>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="align-middle">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaSearch size={24} className="mb-2" />
                      <span>No se encontraron resultados</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top">
          <div className="mb-2 mb-md-0">
            <span className="text-muted">
              Mostrando{" "}
              <strong>
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </strong>{" "}
              de <strong>{table.getFilteredRowModel().rows.length}</strong>{" "}
              registros
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center me-2">
              <span className="me-2">Ir a:</span>
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="form-control form-control-sm"
                style={{ width: "60px" }}
              />
            </div>

            <div className="btn-group">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FaAngleLeft />
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FaAngleRight />
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablaHabilitar;
