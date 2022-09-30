const { Router } = require('express');
const router = Router();
const { postPurchase, getAllPurchases, purchaseMail, shippingMail } = require('../controllers/purchasesController');

router.get('/', getAllPurchases);
router.post('/', postPurchase);
router.post('/purchasemail', purchaseMail)
router.post('/shippingmail', shippingMail) // por el momento no se está utilizando (envia cuando el producto esté en camino)

module.exports = router;