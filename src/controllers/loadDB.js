const { Phones, Brand } = require('../db'); // requiero el modelo
const data = require('../JSONFINALFINAL.json'); // me traigo el Json
const { relacionarPreciosCapacidad } = require('../helpers');

const loadDb = async () => {
	try {
		//TELEFONOS
		let allPhones = data.filter((art) =>
			art.category === 'Phones'
				? {
						// filtro por la categoría y en las que coinciden armo un objeto con las propiedades para que coincidan con el modelo
						category: art.category,
						model: art.model,
						operative_system: art.operative_system,
						size: art.size,
						inches: art.inches,
						main_camera: art.main_camera,
						ram: art.ram,
						capacity: art.capacity,
						frontal_camera: art.frontal_camera,
						weight: art.weight,
						battery: art.battery,
						price: art.price,
						image: art.image,
						cpu: art.cpu,
						description: art.description,
						colors: art.colors
				  }
				: null
		);
		
		let brands = data.map((phone) => phone.brand);
		const setBrandFiltered = new Set();
		let uniqueBrand = [];
		brands.forEach((c) => setBrandFiltered.add(c));
		setBrandFiltered.forEach((c) => uniqueBrand.push(c));
		uniqueBrand = uniqueBrand.map((c) => ({
			name: c,
		}));
		//	SEPARAR LOS PRODUCTOS POR PRECIO EN RELACION A LA CAPACIDAD
		allPhones = relacionarPreciosCapacidad(allPhones);


		await Brand.bulkCreate(uniqueBrand); // a partir del arreglo filtrado cargo todos las categorias
	    //await let allPhones2 = allPhones.map(())
		for (i = 0; i < allPhones.length; i++) {
        let phone = await Phones.create(allPhones[i]);
		//console.log(phone.model, "modelo A VER")
        let model = phone.model
        let phoneBrand = data.filter((e) => e.model === model)
		let brand = phoneBrand[0].brand
		//console.log(phoneBrand, "EL BRANDDDDDDDDDDDD")
        let brandId = await Brand.findOne({ where: { name: brand } });
        await phone.addBrand(brandId.dataValues.id);
		}
		
		//await Phones.bulkCreate(allPhones); // a partir del arreglo filtrado cargo todos los objetos en la tabla PHONES
	} catch (error) {
		console.log(error);
	}
};

module.exports = loadDb; // exporto la funcion para utilizarla en el INDEX y así que se llame cada vez que inicie el server. (falta hacer una validación para que sea mas eficiente.)
