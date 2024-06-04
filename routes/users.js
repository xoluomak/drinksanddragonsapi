const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const userCtrl = require('../controllers/users');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

var jsonParser = bodyParser.json()

router.post('/signup', jsonParser, userCtrl.signup);
router.post('/login', jsonParser, userCtrl.login);
router.get('/users', admin, userCtrl.getAllUsers);
router.delete('/users/:id', jsonParser, auth, userCtrl.deleteUser);
router.put('/users/deviceToken/:id', jsonParser, userCtrl.assignDeviceToken);
router.put('/users/:id', jsonParser, auth, userCtrl.updateUser);
router.put('/users/password/:id', jsonParser, auth, userCtrl.updatePassword);

module.exports = router;