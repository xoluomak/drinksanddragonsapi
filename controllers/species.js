// in controllers/species.js

const Specie = require('../models/species');

exports.createSpecie = (req, res, next) => {
  const specie = new Specie({
    name: req.body.name,
    class: req.body.class,
  });
  specie.save().then(
    () => {
      res.status(201).json({
        message: 'Specie saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(401).json({
        error: error
      });
    }
  );
};

exports.getAllSpecies = (req, res, next) => {
    Specie.find()
      .then(species => res.status(200).json(species))
      .catch(error => res.status(401).json({ error }));
}

exports.getSpecie = (req, res, next) => {
    Specie.findOne({ _id: req.params.id })
      .then(specie => res.status(200).json(specie))
      .catch(error => res.status(401).json({ error }));
}

exports.editSpecie = (req, res, next) => {
    Specie.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Specie edited !'}))
      .catch(error => res.status(401).json({ error }));
}

exports.deleteSpecie = (req, res, next) => {
  Specie.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Specie deleted !'}))
    .catch(error => res.status(401).json({ error }))
};
