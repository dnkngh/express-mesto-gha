const status = require('http2').constants;
const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(status.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found' });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad request' });
      } else {
        res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' });
      }
    });
};

module.exports.addLike = (request, response) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $addToSet: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return response.status(status.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found' });
      }

      return response.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return response.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad request' });
      }

      return response.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });
    });
};

module.exports.deleteLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(status.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found' });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(status.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad request' });
      }

      return res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });
    });
};
