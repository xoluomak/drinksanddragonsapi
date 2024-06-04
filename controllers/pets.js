// in controllers/pets.js
const jwt = require('jsonwebtoken');
const Pet = require('../models/pets');
const User = require('../models/users');

exports.createPet = (req, res, next) => {
  const pet = new Pet({
    name: req.body.name,
    specie: req.body.specie, 
    owner: req.body.owner,
    class: req.body.class,
    frequency: req.body.frequency,
    pictureBase64: req.body.pictureBase64 ? req.body.pictureBase64 : '',
    notifTime: req.body.notifTime,
    nbPrey: req.body.nbPrey,
    weight: [],
    foodType: req.body.foodType,
    enabled: true,
  });
  pet.save().then(
    () => {
      res.status(201).json({
        message: 'Pet saved successfully!'
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

exports.getAllPets = (req, res, next) => {
    Pet.find()
    .populate([{ path: 'owner', model: 'User', select: '_id deviceToken' }])
    .exec((err, pets) => {
      if (err) {
        res.status(401).send(err);
      }
      else {
        res.status(200).json({ pets });
      }
    });
}

exports.getPet = (req, res, next) => {
    Pet.findOne({ _id: req.params.id })
      .then(pet => res.status(200).json(pet))
      .catch(error => res.status(401).json({ error }));
}

exports.getPetByOwner = (req, res, next) => {
    Pet.find({ owner: req.params.id })
      .then(pets => res.status(200).json(pets))
      .catch(error => res.status(401).json({ error }));
}

exports.editPet = (req, res, next) => {
    Pet.findOne({ _id: req.params.id }).then(
      (pet) => {
        if (!pet) {
          res.status(401).json({
            error: new Error('No such Pet!')
          });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'repminder_secret_token_2l|.*8pou]X-m32r');
        const userId = decodedToken.userId;
        if (!userId) {
            throw 'Invalid user ID';
        }
        if (pet.owner !== userId) {
          User.findOne({ _id: userId })
            .then(user => {
              if (!user.admin)
                res.status(401).json({
                  error: new Error('Unauthorized request.')
                });
            })
            .catch(error => res.status(401).json({ error }));
        }
        Pet.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Pet edited !'}))
          .catch(error => res.status(401).json({ error }))
      }
    )
};

exports.deletePet = (req, res, next) => {
    Pet.findOne({ _id: req.params.id }).then(
      (pet) => {
        if (!pet) {
          res.status(401).json({
            error: new Error('No such Pet!')
          });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'repminder_secret_token_2l|.*8pou]X-m32r');
        const userId = decodedToken.userId;
        if (!userId) {
            throw 'Invalid user ID';
        }
        if (pet.owner !== userId) {
          User.findOne({ _id: userId })
            .then(user => {
              if (!user.admin)
                res.status(401).json({
                  error: new Error('Unauthorized request.')
                });
            })
            .catch(error => res.status(401).json({ error }));
        }
        Pet.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'Pet deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(401).json({
              error: error
            });
          }
        );
      }
    )
};