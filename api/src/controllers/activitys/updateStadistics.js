import Activity from "../../models/models/Actividades.js";

export default async function updateStadistics(req, res) {
  const { id } = req.params;
  const { usersQuantity } = req.body;

  try {
    const activity = await Activity.findById(id);
    const stadistics = activity.stadistics;

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const date = `${day}/${month}/${year}`;

    stadistics.push({ date, usersQuantity });

    await Activity.findByIdAndUpdate(id, { stadistics });

    res.status(200).json({ status: "success", message: "Stadistics updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
