const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const Unauthorized = require('../errors/Unauthorized');
const {
  emailError,
  fillField,
  lengthFieldMin,
  lengthFieldMax,
  unauthError,
} = require('../utils/errorMessage');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, fillField],
      minlength: [2, lengthFieldMin],
      maxlength: [30, lengthFieldMax],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: emailError,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(unauthError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized(unauthError);
          }
          return user;
        });
    });
};

userSchema.set('toJSON', {
  transform(doc, res) {
    delete res.password;
    return res;
  },
});

module.exports = mongoose.model('user', userSchema);
