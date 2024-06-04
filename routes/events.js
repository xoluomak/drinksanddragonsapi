const express = require('express');
const router = express.Router();
const eventsCtrl = require('../controllers/events');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', eventsCtrl.getAllEvents);
router.post('/', jsonParser, eventsCtrl.createEvent);
router.delete('/:id', jsonParser, eventsCtrl.deleteEvent);

module.exports = router;