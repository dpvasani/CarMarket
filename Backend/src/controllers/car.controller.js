// controllers/carController.js
const Car = require("../models/Car");
const cloudinary = require("../utils/cloudinary");

// Add a new car
// Add a new car
exports.addCar = async (data, ownerId) => {
  const { title, description, tags, images } = data;

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  if (!images || images.length === 0) {
    throw new Error("At least one image is required.");
  }

  if (images.length > 10) {
    throw new Error("Maximum of 10 images allowed.");
  }

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    images.map((image) => cloudinary.uploadOnCloudinary(image))
  );

  const car = new Car({
    title,
    description,
    tags,
    images: uploadedImages,
    owner: ownerId,
  });

  return car.save();
};
// Get all cars for a specific admin
exports.getAllCarsByOwner = async (ownerId) => {
  return Car.find({ owner: ownerId });
};

// Search cars globally
exports.searchCars = async (keyword) => {
  return Car.searchCars(keyword);
};

// Get car by ID
exports.getCarById = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found.");
  }
  return car;
};

// Update car details
exports.updateCar = async (carId, updateData, ownerId) => {
  const car = await Car.findOne({ _id: carId, owner: ownerId });
  if (!car) {
    throw new Error("Unauthorized or Car not found.");
  }

  // If images are provided, upload new images
  if (updateData.images) {
    const uploadedImages = await Promise.all(
      updateData.images.map((image) => cloudinary.uploadOnCloudinary(image))
    );
    updateData.images = uploadedImages;
  }

  return Car.findByIdAndUpdate(carId, updateData, { new: true });
};

// Delete a car
exports.deleteCar = async (carId, ownerId) => {
  const car = await Car.findOne({ _id: carId, owner: ownerId });
  if (!car) {
    throw new Error("Unauthorized or Car not found.");
  }

  // Delete images from Cloudinary
  await Promise.all(
    car.images.map((image) => cloudinary.deleteOnCloudinary(image))
  );

  return Car.findByIdAndDelete(carId);
};
