const { Schema, model } = require('mongoose');

// definir el modelo de la base de datos
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  __v: { type: Number, select: false },
});

module.exports = model('Product', productSchema);
