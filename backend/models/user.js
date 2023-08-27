const mongoose = require('mongoose');
const validator = require('validator');
// Регулярное выражение для проверки ссылок
// Улучшенная версия регулярного выражения для проверки ссылок
const linkValid = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./#?&]*)*$/;

const userSchema = new mongoose.Schema(
  {
    // уникальный email
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Неверная почта'],
    },
    // хеш пароля
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      // имя
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто', // Дефолтное значение
    },
    about: {
      // о себе
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь', // Дефолтное значение
    },
    avatar: {
      // ссылка на аватарку
      type: String,
      validate: {
        validator(v) {
          return linkValid.test(v);
        },
        message: 'Некорректная ссылка на аватар',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', // Дефолтное значение
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
