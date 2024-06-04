const mongoose = require('mongoose');

const notifSchema = mongoose.Schema({
  logs: { type: Array, required: false },
  watering: { type: Boolean, required: false },
  total: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model('Notif', notifSchema);