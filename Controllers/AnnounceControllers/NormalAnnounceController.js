const NormalAnnounce = require("../../model/Announce/NormalAnnounce.model");
const City = require("../../model/City.model");
const Subcateg = require("../../model/Subcategs.model");
const User = require("../../model/personne/User.model");

exports.addAnnounce = async (req, res) => {
  try {
    const { subject, details, phone, image, price } = req.body;
    const { city, user, subcategorie } = req.params;
    await City.findById(city);
    await User.findById(user);
    await Subcateg.findById(subcategorie);
    const annonce = new NormalAnnounce({
      subject,
      details,
      city,
      user,
      phone,
      image,
      subcategorie,
      price,
    });

    const saved = await annonce.save();
    await Subcateg.findByIdAndUpdate(subcategorie, {
      $push: { announces: saved._id },
    });
    await User.findByIdAndUpdate(user, {
      $push: { announces: saved._id },
    });
    res.status(200).json(saved);
  } catch (err) {
    res.status(200).json({ Error: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const announces = await NormalAnnounce.find();
    res.status(200).json(announces);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};
exports.UpDatedNormalAnnounce = async (req, res) => {
  const { id } = req.params;
  const updatedAnnonce = req.body;

  try {
    const Rst = await NormalAnnounce.findByIdAndUpdate(
      id,
      { $set: updatedAnnonce },
      { new: true }
    );
    if (Rst) {
      await res
        .status(200)
        .json({ message: "Anounce updated!", updatedAnnonce });
    } else {
      throw new Error("AnounceID undefined !");
    }
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};
