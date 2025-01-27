const express = require("express");
const Car = require("../models/Car"); // Assuming the Car model exists
const router = express.Router();
const verifyToken = require("../middleware/VerifyJwt");
const xss = require("xss");
const { check, validationResult } = require("express-validator");
// Get all cars
router.get("/", verifyToken, async (req, res) => {
  try {
    // Sanitize query parameters using xss
    const rawPage = xss(req.query.page);
    const rawLimit = xss(req.query.limit);

    // Parse and validate query parameters, default to 1 and 10 if invalid
    const page = parseInt(rawPage) || 1;
    const limit = parseInt(rawLimit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch cars with pagination
    const cars = await Car.find()
      .skip(skip)
      .limit(limit)
      .populate("category", "name"); // Assuming 'category' is a reference field in the Car model
    const totalCars = await Car.countDocuments();

    res.json({
      cars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cars" });
  }
});
// Count the total number of cars
router.get("/count", verifyToken, async (req, res) => {
  try {
    const carCount = await Car.countDocuments(); // Count total number of cars in the DB
    res.json({ count: carCount }); // Respond with the car count
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error counting cars" });
  }
});
// Get a single car by ID
router.get("/:id", async (req, res) => {
  try {
    const paramId = xss(req.params.id);
    const car = await Car.findById(paramId); // Find car by ID
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car); // Send the car details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching car" });
  }
});

// Add a new car
router.post(
  "/",
  verifyToken,
  [
    // Validate fields
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID"),
    check("color").notEmpty().withMessage("Color is required").escape(),
    check("model").notEmpty().withMessage("Model is required").escape(),
    check("registrationNo")
      .notEmpty()
      .withMessage("Registration number is required")
      .isAlphanumeric()
      .withMessage("Registration number must be alphanumeric")

      .escape(),
  ],
  async (req, res) => {
    const { category, color, model, registrationNo } = req.body;
    try {
      const newCar = new Car({ category, color, model, registrationNo });
      await newCar.save(); // Save the new car in the database
      res.status(201).json(newCar); // Respond with the newly created car
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding car" });
    }
  }
);

// Update a car by ID
router.put(
  "/:id",
  verifyToken,
  [
    // Validate fields
    check("category").optional().isMongoId().withMessage("Invalid category ID"),
    check("color").optional().trim().escape(),
    check("model").optional().trim().escape(),
    check("registrationNumber")
      .optional()
      .isAlphanumeric()
      .withMessage("Registration number must be alphanumeric")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const { category, color, model, registrationNo } = req.body;
    try {
      const car = await Car.findById(req.params.id); // Find the car by ID
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      // Update car details
      car.category = category || car.category;
      car.color = color || car.color;
      car.model = model || car.model;
      car.registrationNo = registrationNo || car.registrationNo;

      await car.save(); // Save the updated car

      res.json(car); // Respond with the updated car
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating car" });
    }
  }
);

// Delete a car by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const paramId = xss(req.params.id);
    const car = await Car.findByIdAndDelete(paramId); // Delete car by ID
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting car" });
  }
});

module.exports = router;
