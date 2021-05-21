const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true} //this will be added automativally from the token being sent to backend

});

//mongoose model name starts with an Uppercase letter
module.exports = mongoose.model('Post', postSchema);
