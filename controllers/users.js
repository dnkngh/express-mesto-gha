const status = require('http2').constants;
const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(status.HTTP_STATUS_BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  userSchema
    .findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad Request' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(status.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found' });
      }

      return res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

module.exports.updateUser = (req, res) => {
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad request' });
      }

      return res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad request' });
      } else {
        res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' });
      }
    });
};
