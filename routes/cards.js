const cardRoutes = require('express').Router();

const {
  addLike,
  createCard,
  deleteCard,
  deleteLike,
  getCards,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', addLike);
cardRoutes.delete('/:cardId/likes', deleteLike);

module.exports = cardRoutes;
