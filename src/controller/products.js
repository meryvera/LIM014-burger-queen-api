const Product = require('../models/product');
const { pagination } = require('../utils/utils');

// GET '/products'
const getProducts = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 10,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const products = await Product.paginate({}, options);

    const url = `${req.protocol}://${req.get('host') + req.path}`;
    const links = pagination(products, url, options.page, options.limit, products.totalPages);

    res.links(links);
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
    const productSaved = await newProduct.save(newProduct);
    const product = await Product.findOne({ _id: productSaved._id });
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
