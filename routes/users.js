const userRoutes = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);
userRoutes.get('/:userId', getUserById);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);

module.exports = userRoutes;
