const jwt = require('jsonwebtoken');

const Unauthorized = require('./errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Пройдите авторизацию2'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, '5sd0fhd5sqsa62ghs');
  } catch (err) {
    return next(new Unauthorized('Пройдите авторизацию'));
  }

  req.user = payload;
  return next();
};
