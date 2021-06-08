const User = require('../models/user');

// GET '/users'
const getUsers = (req, res, next) => {
  res.json({ message: 'TRABAJANDO CON EL CONTROLLER' });
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = (req, res, next) => {
  res.json({ message: 'GET one user' });
};

// POST '/users'

const newUser = (req, res, next) => {
  const adminUser = {
    email: req.body.admin,
    password: req.body.password,
    roles: { admin: req.body.roles.admin },
  };

  User.save(adminUser);

  res.json({ message: 'POST one user' });

  next();
};

// PUT '/users/:uid'

const updateUser = (req, res, next) => {
  res.json({ message: 'PUT one user' });
};

// DELETE '/users/:uid'

const deleteOneUser = (req, res, next) => {
  res.json({ message: 'DELETE one user' });
};

module.exports = {
  getUsers,
  newUser,
  updateUser,
  getOneUser,
  deleteOneUser,
};
