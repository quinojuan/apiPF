const { Phones } = require('../db');
const getAllRams = async (req, res) => {
	try {
		let allPhones = await Phones.findAll();
		let allRams = allPhones.map((phone) => phone.ram);
		const setRamFiltered = new Set();
		let uniqueRam = [];
		allRams.forEach((rams) => {
			rams.forEach((ram) => {
				setRamFiltered.add(ram);
			});
		});
		setRamFiltered.forEach((ram) => {
			uniqueRam.push(ram);
		});
		uniqueRam.sort((a, b) => a - b);
		res.status(200).json(uniqueRam);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = { getAllRams };
