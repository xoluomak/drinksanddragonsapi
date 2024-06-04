const Event = require('../models/events');

exports.createEvent = (req, res, next) => {
  const event = new Event({
    created_at: new Date(),
    ...req.body,
    isEvents: req.body.isEvent ? req.body.isEvent : false,
  });
  event.save().then(
    () => {
      res.status(201).json({
        message: 'Event saved successfully!'
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

exports.getAllEvents = (req, res, next) => {
  Event.find()
    .populate([{ path: 'guests', model: 'MC' }])
    .lean()
    .then(events =>res.status(200).json(events))
    .catch(error => res.status(401).json({ error }));
}

exports.deleteEvent = (req, res, next) => {
  Event.findOne({ _id: req.params.id }).then(
    (event) => {
      if (!event) {
        res.status(401).json({
          error: new Error('No such event!')
        });
      }
      Event.deleteOne({ _id: req.params.id }).then(
        () => {
          res.status(200).json({
            message: 'Event deleted!'
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