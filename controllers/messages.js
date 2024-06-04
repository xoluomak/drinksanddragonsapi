const Message = require('../models/messages');

exports.createMessage = (req, res, next) => {
  const message = new Message({
    date: new Date(),
    author: req.body.author,
    message: req.body.message,
    pictureBase64: req.body.pictureBase64,
  });
  message.save().then(
    () => {
      res.status(201).json({
        message: 'Message saved successfully!'
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

exports.getAllMessages = (req, res, next) => {
  Message.find()
    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(401).json({ error }));
}
