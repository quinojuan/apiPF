const { Router } = require('express');
const router = Router();
const { getAllCapacities } = require('../controllers/capacitiesController');

router.get('/', getAllCapacities);

module.exports = router;
