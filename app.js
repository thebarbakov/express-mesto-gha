const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorHandler = require('./errors/ServerError');
const NotFound = require('./errors/NotFound');

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

app.use((req, res, next) => {
  req.user = {
    _id: '62a7b60075da7554de6a425e',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT} port`);
});
