const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');
const User = require('../models/user');

const { secret } = config;

module.exports.authenthicateUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(400);
  }

  // TODO: autenticar a la usuarix
  const userFind = User.findOne({ email });

  userFind.then((doc) => {
    if (!doc) {
      return res.status(400).json({
        message: 'User Not Exist',
      });
    }
    bcrypt.compare(password, doc.password, (err, data) => {
      // if error than throw error
      if (err) throw err;

      // if both match than you can do anything
      else if (!data) {
        return res.status(400).json({
          message: 'Incorrect Password !',
        });
      }

      jwt.sign(
        {
          id: doc._id,
          email: doc.email,
          role: doc.roles,
        },
        secret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            token,
          });
        },
      );
    });
  });
};
