import { Horarios } from "../../models/index.js";

export class HoursController {
  static getHours = async (req, res) => {
    try {
      const hours = await Horarios.find();

      return res.status(200).json({
        status: "success",
        message: "Horarios encontrados",
        data: {
          hours,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  };

  static createHour = async (req, res) => {
    try {
      const { hourStart, hourFinish } = req.body;
      const newHour = new Horarios({ hourStart, hourFinish });
      newHour.save();
      res
        .status(200)
        .json({ status: "success", message: "Horario creado con exito" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Hubo un error" });
    }
  };
}
