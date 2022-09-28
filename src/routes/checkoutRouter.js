const {Router} = require('express');
const { checkoOut, getCheckout } = require('../controllers/checkoutController');

const router = Router();
checkoOut

router.post('/', checkoOut);
router.get("/", getCheckout)

module.exports = router;