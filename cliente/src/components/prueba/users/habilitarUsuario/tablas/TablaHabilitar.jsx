import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import style from "../../utilidades/style.module.css";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";

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
    return () => {
      // Aquí puedes eliminar la data cuando el componente se desmonta
      data = [];
    };
  }, []);

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
    <div className="container">
      {/* estructura basica de una tabal */}
      <div className="row d-flex">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="buscar usuario"
            onChange={(e) => {
              table.setGlobalFilter(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-sm table-bordered">
          <thead>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <tr key={i}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr key={i}>
                {row.getVisibleCells().map((cell, i) => (
                  <td key={i}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* paginacion */}

      <div
        className={style.pagination}
        style={{
          display: "block",
          margin: "0 auto",
        }}
      >
        {table.getCanPreviousPage() && (
          <>
            <button
              onClick={() => {
                table.setPageIndex(0);
              }}
            >
              Primera Pagina
            </button>
            <button
              onClick={() => {
                table.previousPage();
              }}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </>
        )}

        {table.getCanNextPage() && (
          <>
            <button
              onClick={() => {
                table.nextPage();
              }}
            >
              <i className="bi bi-arrow-right"></i>
            </button>
            <button
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
            >
              Ultima Pagina
            </button>
          </>
        )}
        <span className="flex items-center gap-1 ms-3">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
      </div>
    </div>
  );
}

export default TablaHabilitar;
