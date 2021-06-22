const User = require('../models/user');
const { pagination, validateUser } = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

// GET '/users'
const getUsers = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const users = await User.paginate({}, options);

    const url = `${req.protocol}://${req.get('host') + req.path}`;

    const links = pagination(users, url, options.page, options.limit, users.totalPages);

    res.links(links);
    res.status(200).json(users.docs);
  } catch (err) {
    next(err);
  }
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = async (req, res, next) => {
  try {
    console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    console.log(req.authToken);
    const { uid } = req.params;
    const value = validateUser(uid);
    const user = await User.findOne(value).lean();
    if (!user) {
      return next(404);
    }

    if (req.authToken.uid === user._id.toString() || isAdmin(req)) return res.json(user);
    return next(403);
  } catch (err) {
    console.log(err);
    return next(err);
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
    const userSaved = await newUser.save(newUser);
    const user = await User.findOne({ _id: userSaved._id });

    res.status(200).json(user);
  } catch (err) {
    console.info(err);
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
