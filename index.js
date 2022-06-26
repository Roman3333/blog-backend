import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose
  .connect('mongodb+srv://admin:12345@cluster0.fpmul.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('ошибка', err));

const app = express();
app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Неверный логин or password',
      });
    }

    const token = jwt.sign({ _id: user.id }, 'secret12345', { expiresIn: '45d' });
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось авторизоваться' });
  }
});

app.post('/auth/registration', registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign({ _id: user.id }, 'secret12345', { expiresIn: '45d' });
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось зарегистрироваться' });
  }
});

app.get('/auth/me', checkAuth, (req, res) => {
  try {
    res.json({
      sucsess: true,
    });
  } catch (error) {}
});

app.listen(3333, (err) => {
  if (err) {
    return console.log('Ошибка' + err);
  }

  return console.log('Server works');
});
