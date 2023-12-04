import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Routing from "./routes/Routing";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Routing></Routing>
      {/* comentario */}
    </div>
  );
}

export default App;
