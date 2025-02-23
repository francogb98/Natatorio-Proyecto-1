import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import style from "./tabla.module.css";
import { useEffect, useState } from "react";

function Tabla({ data, columns, type, pageStart }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

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
    if (pageStart && pageStart > 0) {
      table.setPageIndex(pageStart);
    } else {
      table.setPageIndex(0);
    }
  }, [pageStart]);

  return (
    <div className={style.body}>
      {/* estructura basica de una tabal */}
      <div className={style.searchBox}>
        <label htmlFor="">Buscar {type}</label>
        <input
          type="text"
          onChange={(e) => {
            table.setGlobalFilter(e.target.value);
          }}
        />
      </div>
      <div className={style.pagination}>
        {table.getCanPreviousPage() && (
          <>
            <button
              onClick={() => {
                table.setPageIndex(0);
              }}
              className="p-1 btn"
            >
              Primera Pagina
            </button>
            <button
              onClick={() => {
                table.previousPage();
              }}
              className="p-1 btn"
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
              className="p-1 btn"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
            <button
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              className="p-1 btn"
            >
              Ultima Pagina
            </button>
          </>
        )}
        <span className="flex items-center gap-1 ms-3">
          <div>Pagina</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
      </div>

      <table>
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

      {/* paginacion */}

      <div className={style.pagination}>
        {table.getCanPreviousPage() && (
          <>
            <button
              onClick={() => {
                table.setPageIndex(0);
              }}
              className="p-1 btn"
            >
              Primera Pagina
            </button>
            <button
              onClick={() => {
                table.previousPage();
              }}
              className="p-1 btn"
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
              className="p-1 btn"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
            <button
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              className="p-1 btn"
            >
              Ultima Pagina
            </button>
          </>
        )}
        <span className="flex items-center gap-1 ms-3">
          <div>Pagina</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
}

export default Tabla;
