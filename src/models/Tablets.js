const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'Tablets',
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			model: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
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
			main_camera: {
				type: DataTypes.INTEGER,
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
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			weight: {
				type: DataTypes.INTEGER,
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
				type: DataTypes.STRING, // si no se acepta hacer un array de string
				allowNull: false,
			},
			cpu: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			timestamps: false,
			freezeTableName: true,
		}
	);
};
