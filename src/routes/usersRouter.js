const { Router } = require('express');
const {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmail,
} = require('../controllers/usersController.js');
const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;
