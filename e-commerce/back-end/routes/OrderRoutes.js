const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyAuth = require('../middleware/verifyAuth');

// place order
router.post("/", verifyAuth, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      user: req.user.id
    });

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// user only
router.get("/my-orders", verifyUser, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

// admin only
router.get("/admin/orders", verifyAdmin, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});


module.exports = router;