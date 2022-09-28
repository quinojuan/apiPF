const {Router} = require('express');
const {getAllUsers, getUserById, createUser, updateUser} = require('../controllers/usersController.js');
const router = Router();


router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put("/:id", updateUser)

module.exports = router;