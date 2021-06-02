const { Schema, model } = require('mongoose');

// definir el modelo de la base de datos
const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  product: [{
    qty: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    required: true,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
    required: true,
  },
});

module.exports = model('Order', orderSchema);
