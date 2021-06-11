const User = require('../models/user');

// GET '/users'
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.uid });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST '/users'

const newUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save(newUser);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// PUT '/users/:uid'

const updateUser = async (req, res, next) => {
  try {
    const userUpdate = await User.findOneAndUpdate(
      { _id: req.params.uid },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');
    res.status(200).json(userUpdate);
  } catch (err) {
    next(err);
  }
};

// DELETE '/users/:uid'

const deleteOneUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.uid });
    res.json('User deleted =( ');
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
    next(err);
  }
};

module.exports = {
  getUsers,
  newUser,
  updateUser,
  getOneUser,
  deleteOneUser,
};
