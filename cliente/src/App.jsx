import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Routing from "./routes/Routing";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        overflow: "auto",
        //celeste agua
        backgroundColor: "#E0F2F1",
      }}
    >
      <Routing></Routing>
      {/* comentario */}
    </div>
  );
}

export default App;
