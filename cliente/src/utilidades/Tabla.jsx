import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import style from "./tabla.module.css";
import { useState } from "react";

function Tabla({ data, columns, type }) {
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
      </div>
    </div>
  );
}

export default Tabla;
