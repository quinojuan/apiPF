const { Phones } = require('../db');
const getAllCapacities = async (req, res) => {
	try {
		let allPhones = await Phones.findAll();
		let allCapacities = allPhones.map((phone) => phone.capacity[0]);
		const setCapacitiesFiltered = new Set();
		let uniqueCapacities = [];
		allCapacities.forEach((capacity) => {
			setCapacitiesFiltered.add(capacity);
		});
		setCapacitiesFiltered.forEach((capacity) => {
			uniqueCapacities.push(parseInt(capacity));
		});
		uniqueCapacities.sort((a, b) => a - b);
		res.status(200).json(uniqueCapacities);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = { getAllCapacities };
