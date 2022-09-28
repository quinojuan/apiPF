const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'Feedbacks',
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			points: {
				type: DataTypes.FLOAT,
				min: 1,
				max: 5,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);
};
