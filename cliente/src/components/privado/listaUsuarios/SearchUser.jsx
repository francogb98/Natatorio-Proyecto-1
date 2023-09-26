import React, { useCallback, useRef, useState, useEffect } from "react";

import style from "./listaUsuarios.module.css";

import debounce from "just-debounce-it";
import { getUserByName } from "../../../helpers/getUserByName";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);

  const isFirstInput = useRef(true); //no abusar del useref

  //usamos el useref para que al cargar la pagina no tire el error de que el input esta vacio
  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar un nombre CON un numero");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    //el primer valor no puede ser un espacio
    if (search.length === 1 && search.match(/\s/)) {
      setError("El primer valor no puede ser un espacio");

      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }

    if (search.length < 2) {
      setError("La busqueda debe tener al menos 2 caracteres");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }

    setError(null);
  }, [search, isFirstInput.current]);

  return { search, updateSearch, error };
}

function SearchUser({ setUsers, setLoading, setErrorSearch }) {
  const { search, updateSearch, error } = useSearch();

  const debouncedGetUser = useCallback(
    debounce(async ({ search }) => {
      setErrorSearch({ status: false, message: "" });

      if (search.length < 2) {
        setUsers([]);
        setLoading(false);
        return;
      }
      setLoading(true);

      const data = await getUserByName(search);
      if (data.status === "success") {
        setUsers(data.user);
      }
      if (data.status === "error") {
        setErrorSearch({
          status: true,
          message: data.message,
        });
      }
      setLoading(false);
      setTimeout(() => {
        setErrorSearch({ status: false, message: "" });
      }, 2500);
    }, 300),
    [getUserByName]
  );

  const handleChange = (e) => {
    const newSearch = e.target.value;
    updateSearch(newSearch);

    if (newSearch.startsWith(" ")) return updateSearch(newSearch.trim());

    debouncedGetUser({ search: newSearch });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies({ search });
  };
  return (
    <div className={style.formBody}>
      <form action="" className={style.form}>
        <input
          type="text"
          placeholder="Escribir nombre usuario..."
          value={search}
          onChange={handleChange}
          className="form-control"
        />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SearchUser;
