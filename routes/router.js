const router = require('express').Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFound = require('../middlewares/errors/NotFound');
const { loginValidation, createUserValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/*', (req, res, next) => {
  next(new NotFound('Not found'));
});

module.exports = router;
