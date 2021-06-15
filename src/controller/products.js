const Product = require('../models/product');

// GET '/products'
const getProducts = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 10,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const products = await Product.paginate({}, options);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// GET '/products/:productId'

const getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    return res.status(200).json(product);
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
    const productDeleted = await Product.findOne({ _id: req.params.productId });
    await Product.findByIdAndDelete({ _id: req.params.productId });
    if (productDeleted) {
      res.status(200).json(productDeleted);
    }
    res.status(400).json({ message: 'Producto a eliminar no existe' });
  } catch (err) {
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
