import React from "react";
import { useMutation, useQuery } from "react-query";
import User from "./User";

import { getUser } from "../../../helpers/getUsers";
import FormSearch from "./FormSearch";

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {getUserById.isLoading || getUserById.isSuccess ? (
        <User getUserById={getUserById} />
      ) : (
        <FormSearch getUserById={getUserById} />
      )}
    </div>
  );
}

export default SearchUser;
