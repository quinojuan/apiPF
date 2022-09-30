const { Router } = require('express');
const router = Router();
const {
	getAllQas,
	updateQas,
	postQa,
} = require('../controllers/qasController');

router.get('/', getAllQas);
router.put('/:id', updateQas);
router.post('/', postQa);

module.exports = router;