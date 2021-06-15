const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

// definir el modelo de la base de datos
const orderSchema = new Schema({

  __v: { type: Number, select: false },
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    qty: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
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
    required: false,
  },
});

orderSchema.plugin(mongoosePaginate);

module.exports = model('Order', orderSchema);
