const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('Notebooks', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, //CAMBIAR CUANDO NO HAYA REPETIDOS EN EL JSON
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		operative_system: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		size: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		inches: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ram: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: false,
		},
		capacity: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false,
		},
		frontal_camera: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		weight: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		battery: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: false,
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		cpu: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gpu: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		display: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		usb: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		numpad: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	});
};
