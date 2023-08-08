const rateLimit = require('express-rate-limit');
const ManyRequests = require('../errors/ManyRequests');
const { manyRequest } = require('../utils/errorMessage');

const requestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 5 requests per windowMs
  handler: (req, res, next) => next(new ManyRequests(manyRequest)),
});

module.exports = requestLimiter;
