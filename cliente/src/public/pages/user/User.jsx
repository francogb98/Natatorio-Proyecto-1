import { Outlet } from "react-router-dom";

function User() {
  return (
    <div className="container px-5">
      <div className="card-body">
        <Outlet />
      </div>
    </div>
  );
}

export { User };
