import User from "../../../models/models/User.js";

export default async (req, res) => {
  try {
    const { id, foto, public_id_foto } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id },
      { foto, public_id_foto },
      { new: true }
    );
    res.status(200).json({ status: "success", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};
