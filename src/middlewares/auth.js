const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const {
  neededAutorisation,
  notTransmittedToken
} = require('../utils/errorMessage');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(notTransmittedToken);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new Unauthorized(neededAutorisation);
  }

  req.user = payload;
  next();
};
