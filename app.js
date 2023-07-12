const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/router');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL);

app.use(express.json());

app.use(helmet());
app.disable('x-powered-by');

app.use(auth);
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`# Listening port ${PORT}`);
});
