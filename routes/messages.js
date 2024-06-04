const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messages');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', messagesCtrl.getAllMessages);
router.post('/', jsonParser, messagesCtrl.createMessage);

module.exports = router;