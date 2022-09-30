const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'Qas',
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			questions:{
                type: DataTypes.TEXT,
                allowNull: false,
            },
            answers:{
                type: DataTypes.TEXT
            }
		},
		{
			freezeTableName: true,
		}
	);
};