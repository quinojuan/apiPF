const { Router } = require("express");
const router = Router();
const {
	getAllProducts,
	postTablet,
	getAllTablets,
	getTabletById,
	getAllNotebooks,
	getNotebookById,
	postNotebook,
	getAllPhones,
	getPhonesById,
	postPhone
} = require('../controllers/productsController');

router.get("/", getAllProducts);

router.get('/tablets', getAllTablets);
router.get('/tablets/:id', getTabletById);
router.post('/tablets', postTablet);

router.get('/notebooks', getAllNotebooks);
router.get('/notebooks/:id', getNotebookById);
router.post('/notebooks', postNotebook);

router.get('/phones', getAllPhones);
router.get('/phones/:id', getPhonesById);
router.post('/phones', postPhone);


module.exports = router;
