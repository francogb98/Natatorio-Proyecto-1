//creo un archivo para poder ver el pdf que suba el usuario a traves d react-pdf

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { baseUrl } from "../../../../helpers/url";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import style from "./style.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const getFicha = async (id) => {
  const response = await fetch(baseUrl + "user/ficha/" + id);
  const res = await response.json();
  return res;
};

function Pdf() {
  const { id } = useParams();
  const { data } = useQuery(["ficha", id], () => getFicha(id));

  return (
    <div className={style.pdf}>
      <Document file={data?.ficha}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
