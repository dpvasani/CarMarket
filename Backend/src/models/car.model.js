const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  carType: { type: String, required: true },
  company: { type: String, required: true },
  dealer: { type: String, required: true },
  images: [
    { type: String, validate: [arrayLimit, "Exceeds the limit of 10 images"] },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

function arrayLimit(val) {
  return val.length <= 10;
}
// Add a static method for search
carSchema.statics.searchCars = async function (keyword) {
  return this.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ],
  });
};

module.exports = mongoose.model("Car", carSchema);
