const { Category } = require('../db.js');

const getAllCategories = async (req, res) => {
	try {
		let allCategories = await Category.findAll({ attributes: ['name'] });
		if (allCategories.length === 0)
			return res.status(404).json({ message: 'Error en find all' });
		allCategories = allCategories.map((category) => category.name);
		res.status(200).json(allCategories);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
	getAllCategories,
};
