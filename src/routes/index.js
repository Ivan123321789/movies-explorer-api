const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { authValidation, regValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const Unauthorized = require('../errors/Unauthorized');
const { neededAutorisation } = require('../utils/errorMessage');

router.post('/signin', authValidation, login);
router.post('/signup', regValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/', (req, res, next) => {
  next(new Unauthorized(neededAutorisation));
});
module.exports = router;
