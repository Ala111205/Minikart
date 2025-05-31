const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// router.post('/orders', async (req, res) => {
//   const { productId, quantity, price } = req.body;

//   const order = new Order({
//     user: req.user._id,
//     products: [{ product: productId, quantity }],
//     totalAmount: price * quantity,
//   });

//   try {
//     const savedOrder = await order.save();
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(500).json({ error: 'Order failed' });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { items, total, user } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const newOrder = new Order({
      items,
      total,
      user: user || null
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ message: 'Order failed', error: err.message });
  }

});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;