const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  author: { type: String, required: false },
  message: { type: String, required: false },
  pictureBase64: { type: String, required: false },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Message', messageSchema);