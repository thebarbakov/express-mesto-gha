const NotFound = require('../errors/NotFound');
const CastError = require('../errors/CastError');

const User = require('../models/User');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

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

    if (name === undefined || about === undefined) {
      return next(new CastError('Не все поля заполнены'));
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

    await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    });

    return res.status(200).json();
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

    const userUpdate = await User.findByIdAndUpdate(req.user._id, { avatar });

    return res.status(200).json(userUpdate);
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
