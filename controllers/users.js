const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const NotFound = require('../errors/NotFound');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const CastError = require('../errors/CastError');

const User = require('../models/User');

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, '+password');

    if (!user) {
      return next(new UnauthorizedError('Неверный email'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new UnauthorizedError('Пароль не верен'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).cookie('jwt', token, {
      maxAge: 604800,
      httpOnly: true,
    }).send({ token });
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;

    const user = new User({
      email,
      name,
      about,
      avatar,
      password: await bcrypt.hash(password, 10),
    });

    const newUser = await user.save();

    newUser.password = undefined;

    console.log(newUser);

    return res.status(201).json(newUser);
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError('Пользователь уже существует'));
    }
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

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

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        name,
        about,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Неверный формат данных'));
    }

    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Неверный формат данных'));
    }

    return next(e);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json(user);
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
  login,
  getUserInfo,
};
