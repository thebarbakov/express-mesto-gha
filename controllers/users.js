const CastError = require('../errors/CastError');
const NotFound = require('../errors/NotFound');

const User = require('../models/User');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.params.id.length !== 24) {
      return next(
        new CastError('Некорреткно указан id карточки'),
      );
    }
    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(user);
  } catch (e) {
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

    if (name === undefined || about === undefined || avatar === undefined) {
      return next(new CastError('Не все поля заполнены'));
    }
    if (name.length < 2 || name.length > 30) {
      return next(new CastError('Некорретное имя'));
    }
    if (about.length < 2 || about.length > 30) {
      return next(new CastError('Некорретное поле about'));
    }

    const user = new User({ name, about, avatar });

    const newUser = await user.save();

    return res.status(201).json(newUser);
  } catch (e) {
    return next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    if (name !== undefined && (name.length < 2 || name.length > 30)) {
      return next(new CastError('Некорретное имя'));
    }

    if (about !== undefined && (about.length < 2 || about.length > 30)) {
      return next(new CastError('Некорретное имя'));
    }

    await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    });

    return res.status(200).json(req.body);
  } catch (e) {
    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (avatar === undefined) {
      return next(new CastError('Не все поля заполнены'));
    }

    await User.findByIdAndUpdate(req.user._id, { avatar });

    return res.status(200).json(req.body);
  } catch (e) {
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
