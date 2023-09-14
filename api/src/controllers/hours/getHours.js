import Horarios from "../../models/models/Horarios.js";

export const getHours = async (req, res) => {
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
