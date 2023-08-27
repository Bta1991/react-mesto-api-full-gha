const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET = 'your-secret-key' } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return next(new Error('Произошла ошибка при получении пользователей'));
  }
};

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Такого пользователя нет'));
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    return next(new Error('Произошла ошибка при получении пользователя по ID'));
  }
};

exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Такого пользователя нет'));
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    return next(
      new Error(
        'Произошла ошибка при получении информации о текущем пользователе',
      ),
    );
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new NotFoundError('Такого пользователя нет'));
    }
    return res.json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    return next(
      new Error('Произошла ошибка при обновлении профиля пользователя'),
    );
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new NotFoundError('Такого пользователя нет'));
    }
    return res.json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    return next(
      new Error('Произошла ошибка при обновлении аватара пользователя'),
    );
  }
};

exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });
    newUser.password = undefined;
    return res.status(201).json(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError('Переданы некорректные данные пользователя'),
      );
    }
    if (err.code === 11000) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }
    return next(new Error('Произошла ошибка при создании пользователя'));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1w' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: true,
    });
    // return res.send({ message: 'Авторизация успешна' });
    return res.send({ token });
  } catch (err) {
    return next(new Error('Произошла ошибка при попытке входа'));
  }
};
