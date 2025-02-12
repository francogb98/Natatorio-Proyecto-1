import React from "react";

function UsersScheleton() {
  return (
    <div className="row mt-3 justify-content-around g-1">
      {Array(12)
        .fill()
        .map((__, i) => (
          <div key={i} className="col-6 col-lg-4 col-xl-3 p-3">
            <div className="card" aria-hidden="true">
              <div
                className="placeholder-glow"
                style={{
                  width: "100%",
                  height: "200px",
                }}
              >
                {" "}
              </div>
              <div className="card-body">
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-8"></span>
                </p>
                <a
                  className="btn btn-primary disabled placeholder col-6"
                  aria-disabled="true"
                ></a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default UsersScheleton;
