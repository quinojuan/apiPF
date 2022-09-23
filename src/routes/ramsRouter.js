const { Router } = require('express');
const router = Router();
const { getAllRams } = require('../controllers/ramsController');

router.get('/', getAllRams);

module.exports = router;
