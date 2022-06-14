const CastError = require('../errors/CastError');
const NotFound = require('../errors/NotFound');

const User = require('../models/User');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new CastError('Некорректно указан id пользователя'));
    }
    return next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.status(200).json(users);
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;

    const user = new User({ name, about, avatar });

    const newUser = await user.save();

    return res.status(201).json(newUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Переданы некорректные данные'));
    }
    return next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    });

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Переданы некорректные данные'));
    }
    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { avatar });

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Переданы некорректные данные'));
    }
    return next(e);
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
