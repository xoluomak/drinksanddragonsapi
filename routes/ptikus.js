const express = require('express');
const router = express.Router();
const ptikusCtrl = require('../controllers/ptikus');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/', ptikusCtrl.getAllPtikus);
router.post('/', jsonParser, ptikusCtrl.createPtiku);
router.get('/:id', ptikusCtrl.getPtiku);
router.put('/point/:id', ptikusCtrl.addPoint);
router.put('/:id', jsonParser, ptikusCtrl.editPtiku);
router.delete('/:id', jsonParser, ptikusCtrl.deletePtiku);

module.exports = router;