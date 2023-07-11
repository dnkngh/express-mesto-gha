const router = require('express').Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFound = require('../middlewares/errors/NotFound');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => {
  next(new NotFound('Not found'));
});

module.exports = router;
