const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '0bd885b9-3a94-4715-9b47-6375e24059b0',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`# Listening port ${PORT}`);
});
