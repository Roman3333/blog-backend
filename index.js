import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js';

mongoose
  .connect('mongodb+srv://admin:12345@cluster0.fpmul.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('ошибка', err));

const app = express();
app.use(express.json());

app.post('/auth/registration', registerValidator, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json({
    sucsess: true,
  });
});

app.listen(3333, (err) => {
  if (err) {
    return console.log('Ошибка' + err);
  }

  return console.log('Server work');
});
