const Order = require('../models/order');

// GET '/orders'
const getOrders = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 10,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const orders = await Order.paginate({}, options);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// GET '/orders/:orderId'
const getOneOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// POST '/orders'

const newOrder = async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    const order = await newOrder.save(newOrder);
    const orderUpdate = await Order.find({ _id: order._id }).populate('products.product');
    /*     const orderUpdate = await Order.findByIdAndUpdate(
      order._id,
      { $push: { product: req.body.products.product } },
      { new: true, useFindAndModify: false },
    ); */
    console.log(orderUpdate);
    res.status(200).json(orderUpdate);
  } catch (err) {
    next(err);
  }
};

// PUT '/orders/:orderId'

const updateOrder = async (req, res, next) => {
  try {
    const orderUpdate = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');
    res.status(200).json(orderUpdate);
  } catch (err) {
    next(err);
  }
};

// DELETE '/orders/:orderId'

const deleteOneOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete({ _id: req.params.orderId });
    res.json('Order deleted =( ');
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
    next(err);
  }
};

module.exports = {
  getOrders,
  newOrder,
  updateOrder,
  getOneOrder,
  deleteOneOrder,
};
