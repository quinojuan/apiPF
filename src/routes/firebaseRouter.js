const { Router } = require('express');
const router = Router();
const {
    getUserByIdOfFirebase,
    getAllUsersFromFirebase
} = require('../controllers/firebaseController.js');

router.get('/allusers', getAllUsersFromFirebase);
router.get('/user/:id', getUserByIdOfFirebase);

module.exports = router;