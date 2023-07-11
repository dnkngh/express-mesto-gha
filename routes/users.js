const userRoutes = require('express').Router();

const {
  getUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
} = require('../controllers/users');
const {
  userIdValidation,
  validationUpdateAvatar,
  updateUserValidation,
} = require('../middlewares/validation');

userRoutes.get('/me', getUser);
userRoutes.get('/', getUsers);
userRoutes.get('/:userId', userIdValidation, getUserById);
userRoutes.patch('/me', updateUserValidation, updateUser);
userRoutes.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRoutes;
