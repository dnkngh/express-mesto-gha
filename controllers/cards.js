const status = require('http2').constants;

const cardSchema = require('../models/card');
const BadRequest = require('../middlewares/errors/BadRequest');
const InternalServerError = require('../middlewares/errors/InternalServerError');
const NotFound = require('../middlewares/errors/NotFound');
const Forbidden = require('../middlewares/errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.status(status.HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(status.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Bad request'));
      } else {
        next(new InternalServerError('Internal server error'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  cardSchema
    .findById(cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFound('Not found');
      }

      if (!card.owner.equals(req.user._id)) {
        return next(new Forbidden('Forbidden'));
      }

      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Not found');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Bad request'));
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Not found');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequest('Bad request'));
      }
      return next(err);
    });
};
