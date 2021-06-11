const Product = require('../models/product');

// GET '/products'
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// GET '/products/:productId'

const getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// POST '/products'

const newProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save(newProduct);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT '/products/:productId'

const updateProduct = async (req, res, next) => {
  try {
    const productUpdate = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');
    res.status(200).json(productUpdate);
  } catch (err) {
    next(err);
  }
};

// DELETE '/products/:productId'

const deleteOneProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete({ _id: req.params.productId });
    res.json('Product deleted =( ');
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
    next(err);
  }
};

module.exports = {
  getProducts,
  newProduct,
  updateProduct,
  getOneProduct,
  deleteOneProduct,
};
