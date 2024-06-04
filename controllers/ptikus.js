// in controllers/pets.js
const jwt = require('jsonwebtoken');
const Ptiku = require('../models/ptikus');

exports.createPtiku = (req, res, next) => {
  const ptiku = new Ptiku({
    name: req.body.name,
    points: 0,
    createdAt: new Date(),
    modifiedAt: new Date(),
  });
  ptiku.save().then(
    () => {
      res.status(201).json({
        message: 'Ptiku saved successfully!'
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

exports.getAllPtikus = (req, res, next) => {
    Ptiku.find()
      .then(ptikus => res.status(200).json(ptikus))
      .catch(error => res.status(401).json({ error }));
}

exports.getPtiku = (req, res, next) => {
    Ptiku.findOne({ _id: req.params.id })
      .then(ptiku => res.status(200).json(ptiku))
      .catch(error => res.status(401).json({ error }));
}

exports.editPtiku = (req, res, next) => {
    Ptiku.findOne({ _id: req.params.id }).then(
      (ptiku) => {
        if (!ptiku) {
          res.status(401).json({
            error: new Error('No such Ptiku!')
          });
        }
        Ptiku.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Ptiku edited !'}))
          .catch(error => res.status(401).json({ error }))
      }
    )
};

exports.addPoint = (req, res, next) => {
    Ptiku.findOne({ _id: req.params.id }).then(
      (ptiku) => {
        if (!ptiku) {
          res.status(401).json({
            error: new Error('No such Ptiku!')
          });
        }
        Ptiku.updateOne({ _id: req.params.id }, { points: ptiku.points + 1, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Ptiku edited !'}))
          .catch(error => res.status(401).json({ error }))
      }
    )
};

exports.deletePtiku = (req, res, next) => {
    Ptiku.findOne({ _id: req.params.id }).then(
      (ptiku) => {
        if (!ptiku) {
          res.status(401).json({
            error: new Error('No such Ptiku!')
          });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'repminder_secret_token_2l|.*8pou]X-m32r');
        const userId = decodedToken.userId;
        if (!userId) {
            throw 'Invalid user ID';
        }
        Ptiku.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'Ptiku deleted!'
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