const { Router } = require("express");
const router = Router();
const {
	getAllProducts,
	getPhonesById,
	postPhone,
} = require('../controllers/productsController');

router.get("/", getAllProducts);
/* router.get('/phones', getAllPhones); */
router.get('/:id', getPhonesById);
router.post('/', postPhone);


module.exports = router;
