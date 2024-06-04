const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const specieSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  class: { type: String, required: true },
});

specieSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Specie', specieSchema);