const { Router } = require('express');
const router = Router();
const { getAllCategories } = require('../controllers/categoriesController');

router.get('/', getAllCategories);

module.exports = router;
