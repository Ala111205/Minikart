const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const verifyAdmin = require("../middleware/verifyAdmin");
const User = require("../models/user");  // can be admin or normal user
const router=express.Router();

//Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Sign JWT with id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        name: user.firstname + " " + user.lastname,
        email: user.email,
        role: user.role,
        _id: user._id
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Register route
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!firstname || !lastname || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ firstname, lastname, email, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Register route for admin creation
router.post("/register", verifyAdmin, async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!firstname || !lastname || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ firstname, lastname, email, password: hashedPassword, role: "admin" });
    await user.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Forgot Password route
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports=router;
