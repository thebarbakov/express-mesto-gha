const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { linkSchedule } = require('./utils/isLink');

const errorHandler = require('./errors/ServerError');
const NotFound = require('./errors/NotFound');

const { login, createUser } = require('./controllers/users');

const { userAuth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// mongoose.connect(
//   'mongodb+srv://admin:admin@mesto.rhsuxz1.mongodb.net/?retryWrites=true&w=majority',
//   {
//     useNewUrlParser: true,
//   },
// );

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(linkSchedule),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(userAuth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT} port`);
});
