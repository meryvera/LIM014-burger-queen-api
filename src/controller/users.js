const User = require('../models/user');

// GET '/users'
const getUsers = (req, res, next) => {
  User.find({}).then((user) => {
    res.json(user);
  }).catch(next);
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.uid }).then((user) => {
    console.info('GAAAAAAAAAAA', req);
    res.json(user);
  }).catch(next);
};

// POST '/users'

const newUser = (req, res, next) => {
  const adminUser = {
    email: req.body.email,
    password: req.body.password,
    roles: { admin: req.body.roles.admin },
  };

  const newUser = new User(adminUser);

  newUser.save(adminUser);

  res.json(adminUser);

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
