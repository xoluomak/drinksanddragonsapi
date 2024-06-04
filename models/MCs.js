const mongoose = require('mongoose');

const MCSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: String, required: false },
  score: { type: Number, required: false },
  created_at: { type: Date, required: true },
  pictureBase64: { type: String, required: false },
  isAdmin: { type: Boolean, required: false },
  isViewer: { type: Boolean, required: false },
});

module.exports = mongoose.model('MC', MCSchema);