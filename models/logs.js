const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
  mcId: { type: String, required: true },
  score: { type: String, required: false },
  class: { type: String, required: false },
  date: { type: Date, required: false },
});

module.exports = mongoose.model('Logs', logsSchema);