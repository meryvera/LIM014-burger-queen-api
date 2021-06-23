const User = require('../models/user');
const {
  pagination, validateUser, isAValidEmail, isAWeakPassword,
} = require('../utils/utils');
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
    const { uid } = req.params;
    const value = validateUser(uid);
    const user = await User.findOne(value).lean();
    if (!user) {
      return next(404);
    }

    if (req.authToken.uid === user._id.toString() || isAdmin(req)) return res.json(user);
    return next(403);
  } catch (err) {
    return next(err);
  }
};

// POST '/users'

const newUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    if (isAWeakPassword(password) || !isAValidEmail(email)) return next(400);

    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(403).json({
        message: '(Error) El usuario ya se encuentra registrado',
      });
    }

    const newUser = new User(req.body);
    const userSaved = await newUser.save(newUser);
    const user = await User.findOne({ _id: userSaved._id }).select('-password');
    return res.status(200).json(user);
  } catch (err) {
    console.info(err);
    next(err);
  }
};

// PUT '/users/:uid'

const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    console.log(req.body);

    const value = validateUser(uid);
    const user = await User.findOne(value);

    const userId = user._id.toString() || '';

    console.log(req.authToken.uid !== userId);
    console.log(isAdmin(req));
    console.info('LINEA 1', req.body);
    console.info(req.authToken);

    if (req.authToken.uid !== userId && !isAdmin(req)) return next(403);
    console.info('LINEA 1-2', req.body);

    console.log(!isAdmin(req));
    console.log(!isAdmin(req) && user.roles);

    if (!isAdmin(req) && user.roles) return next(403);

    console.info('LINEA 2', req.body);
    console.info(req.authToken);
    if (Object.keys(req.body).length === 0) return next(403);

    console.info('LINEA 3', req.body);
    console.info(req.authToken);
    if (!user) return next(404);

    const userUpdate = await User.findOneAndUpdate(
      { value },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');

    return res.status(200).json(userUpdate);
  } catch (err) {
    console.info('LINEA 4', req.body);
    console.info(req.authToken);
    next(404);
  }
};

// DELETE '/users/:uid'

const deleteOneUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const value = validateUser(uid);
    const userDeleted = await User.findOne(value);

    const userId = userDeleted._id || '';

    if (!userDeleted) return next(404);

    if (req.authToken.uid !== userId || !isAdmin(req)) return next(403);

    await User.findByIdAndDelete({ _id: req.params.uid });

    res.status(200).json(userDeleted);
  } catch (err) {
    next(404);
  }
};

module.exports = {
  getUsers,
  newUser,
  updateUser,
  getOneUser,
  deleteOneUser,
};
