const Card = require('../models/Card');
const CastError = require('../errors/CastError');
const NotFound = require('../errors/NotFound');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
    return next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.cardId });

    if (card.owner._id.toString() !== req.user._id.toString()) {
      return next(new UnauthorizedError('Карточка недоступна для удаления'));
    }

    const deletedCard = await Card.findOneAndDelete({ _id: req.params.cardId });

    if (!deletedCard) {
      return next(
        new NotFound('Запрашиваемая карточка для удаления не найдена'),
      );
    }

    return res.status(200).json();
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new CastError('Передан некорректный ID карточки'));
    }
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
    return res.status(200).json();
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new CastError('Передан некорректный ID карточки'));
    }
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
    return res.status(200).json();
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new CastError('Передан некорректный ID карточки'));
    }
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
