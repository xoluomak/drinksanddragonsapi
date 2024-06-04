const express = require('express');
const router = express.Router();
const speciesCtrl = require('../controllers/species');
const admin = require('../middleware/admin');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', admin, speciesCtrl.getAllSpecies);
router.post('/', admin, jsonParser, speciesCtrl.createSpecie);
router.get('/:id', admin, speciesCtrl.getSpecie);
router.put('/:id', admin, jsonParser, speciesCtrl.editSpecie);
router.delete('/:id', admin, jsonParser, speciesCtrl.deleteSpecie);

module.exports = router;