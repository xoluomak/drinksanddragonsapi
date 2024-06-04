const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  pictureBase64: { type: String, required: false },
  guests: { type: [String], required: false },
  price: { type: Number, required: false },
  location: { type: String, required: false },
  date: { type: Date, required: false },
  isEvent: { type: Boolean, required: false },
  created_at: { type: Date, required: false },
});

module.exports = mongoose.model('Event', EventSchema);