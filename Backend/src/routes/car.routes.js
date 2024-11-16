// routes/carRoutes.js
const express = require("express");
const router = express.Router();
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware");
const carController = require("../controllers/carController");

// Add a car (Admin Only)
router.post("/", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;

    if (!title || !description || !images) {
      return res
        .status(400)
        .json({ error: "Title, description, and images are required." });
    }

    if (images.length > 10) {
      return res.status(400).json({ error: "Maximum of 10 images allowed." });
    }

    const car = await carController.addCar(req.body, req.user.id);
    res.status(201).json({ message: "Car added successfully.", car });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all cars for the admin
router.get("/", verifyJWT, isAdmin, async (req, res) => {
  try {
    const cars = await carController.getAllCarsByOwner(req.user.id);
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search cars globally
router.get("/search", verifyJWT, async (req, res) => {
  try {
    const cars = await carController.searchCars(req.query.keyword);
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get car details
router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const car = await carController.getCarById(req.params.id);
    res.status(200).json(car);
  } catch (error) {
    res.status(404).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
});

// Delete a car (Admin Only)
router.delete("/:id", verifyJWT, isAdmin, async (req, res) => {
  try {
    await carController.deleteCar(req.params.id, req.user.id);
    res.status(200).json({ message: "Car deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
