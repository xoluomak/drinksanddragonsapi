const mongoose = require('mongoose');

const ptikuSchema = mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  pic: { type: String, required: false },
  deviceToken: { type: String, required: false },
  createdAt: { type: Date, required: true },
  modifiedAt: { type: Date, required: true },
});

module.exports = mongoose.model('Ptiku', ptikuSchema);