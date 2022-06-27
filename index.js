import express from 'express';
import mongoose from 'mongoose';

import { registerValidator } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { login, registration, getMe } from './controllers/UserController.js';

mongoose
  .connect('mongodb+srv://admin:12345@cluster0.fpmul.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('ошибка', err));

const app = express();
app.use(express.json());

app.post('/auth/login', login);
app.post('/auth/registration', registerValidator, registration);
app.get('/auth/me', checkAuth, getMe);

app.listen(3333, (err) => {
  if (err) {
    return console.log('Ошибка' + err);
  }

  return console.log('Server works');
});
