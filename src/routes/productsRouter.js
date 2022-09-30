const { Router } = require('express');
const router = Router();
const {
	getAllProducts,
	getPhonesById,
	postPhone,
	updatePhone,
	deletePhone,
} = require('../controllers/productsController');

router.get('/', getAllProducts);
router.get('/:id', getPhonesById);
router.post('/', postPhone);
router.put('/:id', updatePhone);
router.delete('/:id', deletePhone);

module.exports = router;
