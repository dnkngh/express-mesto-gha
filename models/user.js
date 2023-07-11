const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Unauthorized = require('../middlewares/errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isUrl(url),
      message: 'Некорректный URL',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    unique: true,
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверный адрес почты',
    },
  },
});

userSchema.statics.findUserByCredentials = function _(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Unauthorized('Неверный пароль или адрес почты'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new Unauthorized('Неверный пароль или адрес почты'));
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
