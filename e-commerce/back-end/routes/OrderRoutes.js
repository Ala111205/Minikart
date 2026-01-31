const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');


// place order
router.post("/", verifyUser, async (req, res) => {
  const order = await Order.create({
    ...req.body,
    user: req.user.id
  });

  res.json(order);
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