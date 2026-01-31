const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');


// place order
router.post('/', verifyUser, async (req, res) => {
  try {
    const { items, total, customer } = req.body;

    const newOrder = new Order({
      items,
      total,
      customer,
      user: req.user.id
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get my orders
router.get('/my-orders', verifyUser, async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(orders);
});


// admin only
router.get('/admin/all', verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;