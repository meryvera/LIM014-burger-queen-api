const User = require('../models/user');

// GET '/users'
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const listUser = [];
    users.forEach((user) => {
      listUser.push({
        _id: user._id,
        email: user.email,
        password: user.password,
        roles: user.roles,
      });
    });
    res.status(200).json(listUser);
  } catch (err) {
    next(err);
  }
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.uid });
    res.status(200).json(
      {
        _id: user._id,
        email: user.email,
        password: user.password,
        roles: user.roles,
      },
    );
  } catch (err) {
    next(err);
  }
};

// POST '/users'

const newUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save(newUser);
    res.status(200).json(
      {
        _id: user._id,
        email: user.email,
        password: user.password,
        roles: user.roles,
      },
    );
  } catch (err) {
    next(err);
  }
};

// PUT '/users/:uid'

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.uid });
    user.email = req.body.email ? req.body.email : user.email;
    user.password = req.body.password ? req.body.password : user.password;
    user.roles = req.body.roles ? req.body.roles : user.roles;

    const userSaved = await user.save({ validateBeforeSave: true });

    res.status(200).json(
      {
        _id: user._id,
        email: userSaved.email,
        password: userSaved.password,
        roles: userSaved.roles,
      },
    );
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
