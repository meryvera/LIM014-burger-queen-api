const User = require('../models/user');

// GET '/users'
const getUsers = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 10,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const users = await User.paginate({}, options);

    const linkHeader = {
      first: `http://localhost:8081/users?limit=${options.limit}&page=1`,
      prev: users.hasPrevPage ? `http://localhost:8081/users?limit=${options.limit}&page=${options.page - 1}` : false,
      next: users.hasNextPage ? `http://localhost:8081/users?limit=${options.limit}&page=${options.page + 1}` : false,
      last: users.totalPages ? `http://localhost:8081/users?limit=${options.limit}&page=${users.totalPages}` : false,
    };

    const obj = Object.entries(linkHeader);

    const links = [];

    obj.forEach((e) => {
      if (e !== false && e !== undefined) {
        links.push(e);
      }
    });

    // const
    res.set('link', links);
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
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(409).json({
        message: '(Error) El usuario ya se encuentra registrado',
      });
    }

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
    const userDeleted = await User.findOne({ _id: req.params.uid });
    await User.findByIdAndDelete({ _id: req.params.uid });
    if (userDeleted) {
      res.status(200).json(userDeleted);
    }
    res.status(400).json({ message: 'Usuario a eliminar no existe' });
  } catch (err) {
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
