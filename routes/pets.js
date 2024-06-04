const express = require('express');
const router = express.Router();
const petsCtrl = require('../controllers/pets');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', admin, petsCtrl.getAllPets);
router.post('/', jsonParser, auth, petsCtrl.createPet);
router.get('/:id', auth, petsCtrl.getPet);
router.get('/owner/:id', auth, petsCtrl.getPetByOwner);
router.put('/:id', jsonParser, auth, petsCtrl.editPet);
router.delete('/:id', jsonParser, auth, petsCtrl.deletePet);

module.exports = router;