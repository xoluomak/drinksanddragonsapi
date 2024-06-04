const express = require('express');
const router = express.Router();
const notifsCtrl = require('../controllers/notifs');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', notifsCtrl.getAllNotifs);
router.post('/', jsonParser, notifsCtrl.createNotif);
router.post('/feed/', jsonParser, notifsCtrl.notifUsers);
router.post('/send/', jsonParser, notifsCtrl.sendNotificationToAll);
router.post('/send/token/:token', jsonParser, notifsCtrl.sendNotificationToUserToken);
router.post('/send/:id', jsonParser, notifsCtrl.sendNotificationToUser);
router.delete('/:id', jsonParser, notifsCtrl.deleteNotif);

module.exports = router;