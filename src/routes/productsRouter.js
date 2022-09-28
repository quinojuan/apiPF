const { Router } = require('express');
const router = Router();
const {
	getAllProducts,
	getPhonesById,
	postPhone,
	updatePhone
} = require('../controllers/productsController');


router.get('/', getAllProducts);
router.get('/:id', getPhonesById);
router.post('/', postPhone);
router.put("/:id", updatePhone)

module.exports = router;
