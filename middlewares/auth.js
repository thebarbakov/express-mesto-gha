const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization.split(' ')[1];

    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    const userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = { userAuth };
