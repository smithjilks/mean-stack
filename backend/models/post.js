const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {tyrpe: String, required: true}

});

//mongoose model name starts with an Uppercase letter
module.exports = mongoose.model('Post', postSchema);
