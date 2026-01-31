const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  customer: {
    name: String,
    address: String,
    phone: String
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      // snapshot values (important)
      price: Number,
      name: String
    }
  ],

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['pending','processing','shipped','delivered','cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);