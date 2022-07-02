const Card = require('../models/Card');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const CastError = require('../errors/CastError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    res.status(200).json(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const card = new Card({
      name,
      link,
      owner: req.user._id,
    });

    const newCard = await card.save();

    return res.status(201).json(newCard);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Неверный формат данных'));
    }
    return next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.cardId });

    if (!card) {
      return next(
        new NotFound('Запрашиваемая карточка для удаления не найдена'),
      );
    }

    if (card.owner._id.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError('Карточка недоступна для удаления'));
    }

    await Card.findOneAndDelete({ _id: req.params.cardId });

    return res.status(200).json({ message: 'Ok!' });
  } catch (e) {
    return next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.cardId },
      { $push: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(
        new NotFound('Запрашиваемая карточка для добавления лайка не найдена'),
      );
    }
    return res.status(200).json({ message: 'Ok!' });
  } catch (e) {
    return next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.cardId },
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(
        new NotFound('Запрашиваемая карточка для добавления лайка не найдена'),
      );
    }
    return res.status(200).json({ message: 'Ok!' });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
