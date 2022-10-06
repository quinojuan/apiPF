const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define(
		'Users',
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			email: {
				type: DataTypes.TEXT,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: {
						params: true,
						message: 'require a validate email',
					},
				},
			},
			name: {
				type: DataTypes.STRING,
			},
			password: {
				type: DataTypes.TEXT,
			},
			admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			superadmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			freezeTableName: true,
		}
	);
};
