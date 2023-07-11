const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/router');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { createUserValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);
app.use(router);
app.use(errors());

app.listen(PORT, () => {
  console.log(`# Listening port ${PORT}`);
});
