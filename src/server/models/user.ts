import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  const user = this;
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

// userSchema.methods.generateJwt = function() {
//   const expiry = new Date();
//   expiry.setDate(expiry.getDate() + 7);

//   return jwt.sign({
//     _id: this._id,
//     email: this.email,
//     name: this.name,
//     // tslint:disable-next-line:radix
//     exp: parseInt(expiry.getTime() / 1000),
//   }, 'MY_SECRET'); // DO NOT KEEP YOUR SECRET IN THE CODE!
// };

const User = mongoose.model('User', userSchema);

export default User;
