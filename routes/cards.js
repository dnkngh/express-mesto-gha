const cardRoutes = require('express').Router();

const {
  addLike,
  createCard,
  deleteCard,
  deleteLike,
  getCards,
} = require('../controllers/cards');
const {
  createCardValidation,
  cardByIdValidation,
} = require('../middlewares/validation');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCardValidation, createCard);
cardRoutes.delete('/:cardId', cardByIdValidation, deleteCard);
cardRoutes.put('/:cardId/likes', cardByIdValidation, addLike);
cardRoutes.delete('/:cardId/likes', cardByIdValidation, deleteLike);

module.exports = cardRoutes;
