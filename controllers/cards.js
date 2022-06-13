const Card = require('../models/Card');
const CastError = require('../errors/CastError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card({});

    res.status(200).json(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    if (name === undefined || link === undefined) {
      return next(new CastError('Не все поля заполнены'));
    }

    if (name.length < 2 || name.length > 30) {
      return next(new CastError('Некорретное имя'));
    }

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
    const card = await Card.findById(req.params.cardId);

    if (!card) next(new CastError('Карточки не существует'));

    await Card.findByIdAndDelete(req.params.cardId);

    return res.status(200).json();
  } catch (e) {
    return next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(
        new CastError('Запрашиваемая карточка для добавления лайка не найдена'),
      );
    }

    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    return res.status(200).json();
  } catch (e) {
    return next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(
        new CastError('Запрашиваемая карточка для добавления лайка не найдена'),
      );
    }

    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    return res.status(200).json();
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
