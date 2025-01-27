const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const xss = require('xss');
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Signup Route
router.post("/signup", [
  check('email')
  .isEmail().withMessage('Invalid email format')
  .normalizeEmail(), // Normalize email to avoid issues like casing
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = xss(req.body.email);  // Sanitize the email input

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random password
    const passwordGenerated = Math.random().toString(36).slice(-8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordGenerated, 10);

    // Save user to database
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Send email with password
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // For Gmail
      port: 587, // Use 465 for SSL, 587 for TLS
      secure: false, // Set to true if using SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Our System",
      text: `Your login password is: ${passwordGenerated}`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ message: "User created, check your email for password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login",  [
  check("email").isEmail().withMessage("Invalid email format").normalizeEmail(), // Normalize the email input
  check("password").isLength({ min: 6 }).withMessage("Password should be at least 6 characters long")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = xss(req.body.email);  // sanitize the email input
  const { password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
