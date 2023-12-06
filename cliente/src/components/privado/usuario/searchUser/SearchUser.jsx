import React from "react";
import { useMutation } from "react-query";
import User from "../UserInfo/User";

import { getUser } from "../../../../helpers/getUsers";
import FormSearch from "./FormSearch";

import style from "./style.module.css";

function SearchUser() {
  const getUserById = useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      if (data.status == "error") {
        setTimeout(() => {
          getUserById.reset();
        }, 3000);
      }
    },
  });

  return (
    <div className={style.body}>
      {getUserById.isLoading || getUserById.isSuccess ? (
        <User getUserById={getUserById} />
      ) : (
        <FormSearch getUserById={getUserById} />
      )}
    </div>
  );
}

export default SearchUser;
