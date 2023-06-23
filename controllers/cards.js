const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Internal server error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
      } else {
        res.status(500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Not found' });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Bad request' });
      } else {
        res.status(500).send({ message: 'Internal server error' });
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
        return response.status(404).send({ message: 'Not found' });
      }

      return response.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return response.status(400).send({ message: 'Bad request' });
      }

      return response.status(500).send({ message: 'Internal server error' });
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
        return res.status(404).send({ message: 'Not found' });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Bad request' });
      }

      return res.status(500).send({ message: 'Internal server error' });
    });
};
