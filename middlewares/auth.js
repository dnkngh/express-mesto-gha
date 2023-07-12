const jwt = require('jsonwebtoken');

const Unauthorized = require('./errors/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookie.jwt;

  if (!token) {
    return next(new Unauthorized('Пройдите авторизацию2'));
  }

  let payload;

  try {
    payload = jwt.verify(token, '5sd0fhd5sqsa62ghs');
  } catch (err) {
    return next(new Unauthorized('Пройдите авторизацию'));
  }

  req.user = payload;
  return next();
};
