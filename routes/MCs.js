const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const McCtrl = require('../controllers/MCs');

var jsonParser = bodyParser.json()

router.post('/signup', jsonParser, McCtrl.signup);
router.post('/login', jsonParser, McCtrl.login);
router.get('/users', McCtrl.getAllMCs);
router.get('/delete/:id', McCtrl.deleteMC);
router.get('/logs/:id', McCtrl.getLogsByMC);
router.put('/users/:id', jsonParser, McCtrl.updateMC);

module.exports = router;