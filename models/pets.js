const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
  name: { type: String, required: true },
  specie: { type: String, required: true },
  class: { type: String, required: true },
  frequency: { type: Number, required: true },
  nbPrey: { type: Number, required: true },
  notifTime: { type: Number, required: true },
  foodType: { type: String, required: true },
  owner: { type: String, required: true },
  pictureBase64: { type: String },
  weight: { type: Array, required: false },
  lastMeal: { type: Array, required: false },
  lastWater: { type: Array, required: false },
  enabled: { type: Boolean, required: true },
});

module.exports = mongoose.model('Pet', petSchema);