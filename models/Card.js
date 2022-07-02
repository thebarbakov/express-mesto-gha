const { Schema, model, Types } = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Некорректный формат ссылки',
      },
    },
    owner: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = model('Card', cardSchema);
