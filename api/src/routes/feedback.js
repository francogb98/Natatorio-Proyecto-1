import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import verFeedbacks from "../controllers/feedback/verFeedbacks.js";
import NuevoFeedback from "../controllers/feedback/NuevoFeedback.js";

const rutaFeed = Router();

//feedback
rutaFeed.post("/", NuevoFeedback);
rutaFeed.get("/:pagina", verFeedbacks);

export default rutaFeed;
