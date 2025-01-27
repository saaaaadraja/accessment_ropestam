const express = require("express");
const { check, validationResult } = require("express-validator");
const Category = require("../models/Category");
const verifyToken = require("../middleware/VerifyJwt");
const xss = require("xss");

const router = express.Router();

// Create a new category
router.post(
  "/",
  [check("name").notEmpty().withMessage("Category name is required")],
  verifyToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  }
);

// Get all categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Update a category
router.put(
  "/:id",
  [check("name").notEmpty().withMessage("Category name is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  }
);

// Delete a category
router.delete("/:id", async (req, res) => {
  const categoryId = xss(req.params.id);

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Category deleted" });
});

module.exports = router;
