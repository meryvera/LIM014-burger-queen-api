const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFind = User.findOne({ email: decodedToken.email });

    userFind.then((doc) => {
      if (doc) {
        req.authToken = decodedToken;

        console.info('El usuario del token si existe');
        return next();
      }
    });
  });
};

module.exports.isAuthenticated = (req) => (
  // console.info('isadmin', req.authToken)
  req.authToken.id
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
);

module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.authToken.role.admin

);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
