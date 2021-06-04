const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/user');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    // TODO: autenticar a la usuarix

    const authUser = {
      email,
      password,
    };

    try {
      User.findOne(authUser, (user) => {
        console.log(user);
        if (!user) {
          return res.status(400).json({
            message: 'User Not Exist',
          });
        }

        const isMatch = user.comparePassword(password);

        if (!isMatch) {
          return res.status(400).json({
            message: 'Incorrect Password !',
          });
        }
      });

      jwt.sign(
        authUser,
        'randomString',
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        },
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: 'Server Error',
      });
    }
  });

  return nextMain();
};
