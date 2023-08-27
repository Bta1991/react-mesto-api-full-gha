const mongoose = require('mongoose');

// Регулярное выражение для проверки ссылок
const linkValid = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./#?&]*)*$/;

const cardSchema = new mongoose.Schema({
  name: {
    // имя карточки
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    // ссылка на картинку
    type: String,
    required: true,
    validate: {
      validator(v) {
        return linkValid.test(v);
      },
      message: 'Некорректная ссылка на аватар',
    },
  },
  owner: {
    // ссылка на модель автора карточки (тип ObjectId)
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    // список лайкнувших пост пользователей (массив ObjectId)
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    // дата создания (тип Date)
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
