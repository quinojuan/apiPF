const { Users } = require('../db.js');
const bCrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
	try {
		let allUsers = await Users.findAll();
		// if(allUsers.length === 0) return res.status(404).json({message: "cannot find info in database"});
		// allUsers = allUsers.filter((users) => users.active === true); // esta validación entra en conflicto con el bannear usuarios. Dejarla comentada
		res.status(200).json(allUsers);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) res.status(404).json({ message: 'id is not provided' });
		const validation = await Users.findByPk(id);
		if (!validation) {
			res.status(404).json({ message: 'id not exists' });
		}
		// if (validation.active === false) esta validación entra en conflicto con el bannear usuarios. Dejarla comentada
		// 	return res.status(400).json({ message: 'user not active' });
		res.status(201).json(validation);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

const getUserByEmail = async (req, res) => {
	try {
		const { email } = req.params;
		if (!email) return res.status(200).json({ name: 'Usuario' });
		const validation = await Users.findOne({ where: { email: email } });
		if (!validation) {
			return res.status(200).json({ name: 'Usuario' });
		}
		if (validation.active === false)
			return res.status(400).json({ message: 'user not active' });
		res.status(201).json(validation);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

const createUser = async (req, res) => {
	try {
		let { name, password, email } = req.body; // desestructuro un obj con propiedades anidadas
		if(!name) name = ""
		let passwordHash = bCrypt.hashSync(password, 10);
		if (!email) return res.status(404).json({ message: 'id is not provided' });

		const validation = await Users.findOne({ where: { email } });
		if (validation) {
			return res.status(404).json({ message: 'user already exists' });
		} else {
			const newUser = await Users.findOrCreate({
				where: { name, email, password: passwordHash },
			});
			return res.status(201).json({ message: `${email} created! :D` });
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		//console.log(id, "IDDD")

		//console.log(req.body, "BODY")
		let [updateUser] = await Users.update(req.body, { where: { id } });
		console.log(updateUser, 'User');
		if (updateUser) {
			res.status(201).json(updateUser);
		} else {
			res.status(404).json({ message: 'Error /put updateUser' });
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error missing info' });
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		let [deleteUser] = await Users.update({ active: 0 }, { where: { id } });
		if (!deleteUser) return res.status(404).json({ message: 'user not found' });
		else res.status(200).json({ message: 'user deleted' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmail
};
