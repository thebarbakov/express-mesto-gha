const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./errors/ServerError');
const NotFound = require('./errors/NotFound');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// mongoose.connect('mongodb+srv://admin:admin@mesto.rhsuxz1.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
// });

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT} port`);
});
