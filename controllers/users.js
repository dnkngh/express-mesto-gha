const status = require('http2').constants;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = require('../models/user');

const BadRequest = require('../middlewares/errors/BadRequest');
const NotFound = require('../middlewares/errors/NotFound');
const AlreadyTaken = require('../middlewares/errors/AlreadyTaken');

module.exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Not found');
      }
      res.status(status.HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema
        .create({
          name, about, avatar, email, password: hash,
        })
        .then(() => res.status(status.HTTP_STATUS_CREATED)
          .send({
            data: {
              name, about, avatar, email,
            },
          }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new AlreadyTaken('This email has already been registrred'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequest('Bad request'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  userSchema
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Bad request'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound('Not found');
      }
      res.status(status.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Bad request'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Not found');
      }
      return userSchema.findByIdAndUpdate(
        req.user._id,
        { avatar },
        {
          new: true,
          runValidators: true,
        },
      );
    })
    .then((user) => res.status(status.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Bad request'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '5sd0fhd5sqsa62ghs',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
