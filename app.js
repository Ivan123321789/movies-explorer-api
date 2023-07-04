require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { CORS } = require('./src/middlewares/CORS');
const { requestLogger, requestLimiter, errorLogger } = require('./src/middlewares/logger');
const { authValidation, regValidation } = require('./src/middlewares/validation');
const { login, createUser } = require('./src/controllers/users');
const auth = require('./src/middlewares/auth');
const userRouter = require('./src/routes/users');
const movieRouter = require('./src/routes/movies');
const Unauthorized = require('../errors/Unauthorized');
const { neededAutorisation } = require('../utils/errorMessage');
const errorHandler = require('./src/middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();
app.use(helmet());
app.use(CORS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(DB_URL)
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(requestLogger);
app.use(requestLimiter);
app.post('/signin', authValidation, login);
app.post('/signup', regValidation, createUser);
app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use('/', (req, res, next) => {
  next(new Unauthorized(neededAutorisation));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
