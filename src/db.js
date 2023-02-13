require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(process.env.DATABASE_URL || 
	`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
	{
	  dialectOptions: {
		ssl: {
		  require: true,
		  rejectUnauthorized: false,
		},
	  },
	  logging: false, // set to console.log to see the raw SQL queries
	  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
	}
  );
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
	.filter(
		(file) =>
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
	)
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Brand, Phones, Users, Purchases, Feedbacks, Qas, Quantities } = sequelize.models;
/*

Faltarían las relaciones de Feedbacks
-Todos los productos tiene feedbacks
-Los feedbacks están escritos por los usuarios

*/
Feedbacks.belongsToMany(Phones, { through: 'PhoneFeedbacks', foreignKey: 'FeedbacksId' });
Phones.belongsToMany(Feedbacks, { through: 'PhoneFeedbacks', foreignKey: 'PhoneId' });
Feedbacks.belongsToMany(Users, { through: 'UsersFeedbacks', foreignKey: 'FeedbacksId' });
Users.belongsToMany(Feedbacks, { through: 'UsersFeedbacks', foreignKey: 'UsersId' });

Qas.belongsToMany(Phones, { through: 'PhoneQas', foreignKey: 'QasId' });
Phones.belongsToMany(Qas, { through: 'PhoneQas', foreignKey: 'PhoneId' });
Qas.belongsToMany(Users, { through: 'UsersQas', foreignKey: 'QasId' });
Users.belongsToMany(Qas, { through: 'UsersQas', foreignKey: 'UsersId' });

Brand.belongsToMany(Phones, { through: 'PhoneBrand', foreignKey: 'BrandId' });
Phones.belongsToMany(Brand, { through: 'PhoneBrand', foreignKey: 'PhoneId' });
Purchases.belongsToMany(Users, {
	through: 'UsersPurchases',
	foreignKey: 'PurchasesId',
});
Users.belongsToMany(Purchases, {
	through: 'UsersPurchases',
	foreignKey: 'UsersId',
});
Purchases.belongsToMany(Phones, {
	through: 'PhonePurchases',
	foreignKey: 'PurchasesId',
});
Phones.belongsToMany(Purchases, {
	through: 'PhonePurchases',
	foreignKey: 'PhonesId',
});

Quantities.belongsToMany(Phones, { through: 'PhoneQuantities', foreignKey: 'QuantitiesId' });
Phones.belongsToMany(Quantities, { through: 'PhoneQuantities', foreignKey: 'PhoneId' });
Quantities.belongsToMany(Purchases, { through: 'PurchasesQuantities', foreignKey: 'QuantitiesId' });
Purchases.belongsToMany(Quantities, { through: 'PurchasesQuantities', foreignKey: 'PurchasesId' });

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
