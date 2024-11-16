import Car from "../models/Car.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

// Add a new car
export const addCar = async (data, ownerId) => {
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
    images.map((image) => uploadOnCloudinary(image))
  );

  const car = new Car({
    title,
    description,
    tags,
    images: uploadedImages,
    createdBy: ownerId,
  });

  return car.save();
};

// Get all cars for a specific admin
export const getAllCarsByOwner = async (ownerId) => {
  return Car.find({ createdBy: ownerId });
};

// Search cars globally
export const searchCars = async (keyword) => {
  return Car.searchCars(keyword);
};

// Get car by ID
export const getCarById = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found.");
  }
  return car;
};

// Update car details
export const updateCar = async (carId, updateData, ownerId) => {
  const car = await Car.findOne({ _id: carId, createdBy: ownerId });
  if (!car) {
    throw new Error("Unauthorized or Car not found.");
  }

  // If images are provided, upload new images
  if (updateData.images) {
    const uploadedImages = await Promise.all(
      updateData.images.map((image) => uploadOnCloudinary(image))
    );
    updateData.images = uploadedImages;
  }

  return Car.findByIdAndUpdate(carId, updateData, { new: true });
};

// Delete a car
export const deleteCar = async (carId, ownerId) => {
  const car = await Car.findOne({ _id: carId, createdBy: ownerId });
  if (!car) {
    throw new Error("Unauthorized or Car not found.");
  }

  // Delete images from Cloudinary
  await Promise.all(car.images.map((image) => deleteOnCloudinary(image)));

  return Car.findByIdAndDelete(carId);
};
