import express from "express";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";
import carController from "../controllers/carController.js";

const router = express.Router();

// Helper function to handle errors
const handleError = (res, error) => {
  res.status(400).json({ error: error.message || "Something went wrong" });
};

// Add a car (Admin Only)
router.post("/", verifyJWT, isAdmin, async (req, res) => {
  const { title, description, tags, images } = req.body;

  if (!title || !description || !images) {
    return res
      .status(400)
      .json({ error: "Title, description, and images are required." });
  }

  if (images.length > 10) {
    return res.status(400).json({ error: "Maximum of 10 images allowed." });
  }

  try {
    const car = await carController.addCar(req.body, req.user.id);
    res.status(201).json({ message: "Car added successfully.", car });
  } catch (error) {
    handleError(res, error);
  }
});

// Get all cars for the admin
router.get("/", verifyJWT, isAdmin, async (req, res) => {
  try {
    const cars = await carController.getAllCarsByOwner(req.user.id);
    res.status(200).json(cars);
  } catch (error) {
    handleError(res, error);
  }
});

// Search cars globally
router.get("/search", verifyJWT, async (req, res) => {
  try {
    const cars = await carController.searchCars(req.query.keyword);
    res.status(200).json(cars);
  } catch (error) {
    handleError(res, error);
  }
});

// Get car details
router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const car = await carController.getCarById(req.params.id);
    res.status(200).json(car);
  } catch (error) {
    res.status(404).json({ error: "Car not found." });
  }
});

// Update car details (Admin Only)
router.patch("/:id", verifyJWT, isAdmin, async (req, res) => {
  try {
    const updatedCar = await carController.updateCar(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json({ message: "Car updated successfully.", updatedCar });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete a car (Admin Only)
router.delete("/:id", verifyJWT, isAdmin, async (req, res) => {
  try {
    await carController.deleteCar(req.params.id, req.user.id);
    res.status(200).json({ message: "Car deleted successfully." });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
