const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');  //npm install --save mongoose-unique-validator


const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},  // not a validator
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

//mongoose model name starts with an Uppercase letter
module.exports = mongoose.model('User', userSchema);
