const { Router } = require('express');
const router = Router();
const { getAllBrands } = require('../controllers/brandsController');

router.get('/', getAllBrands);

module.exports = router;
