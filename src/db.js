require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/movilgates`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

const sequelize = new Sequelize(process.env.DATABASE_URL || DATABASE_LOCAL, {
	dialectOptions: {
	  ssl: {
	    require: true,
	    rejectUnauthorized: false,
	  },
	},
	logging: false, // set to console.log to see the raw SQL queries
	native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  });

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
const { Colors, Products, Category } = sequelize.models;

Category.belongsToMany(Products, {through: "ProductCategory"})
Products.belongsTo(Category,{through: "ProductCategory"})
Products.belongsToMany(Colors,{through: "ProductsColors"})
Colors.belongsToMany(Products,{through: "ProductsColors"})
/* Tablets.belongsToMany(Colors, {
	through: 'TabletsColors',
	foreignKey: 'tabletId',
});

Colors.belongsToMany(Tablets, {
	through: 'TabletsColors',
	foreignKey: 'colorId',
});

Phones.belongsToMany(Colors, {
	through: 'TabletsColors',
	foreignKey: 'tabletId',
});

Colors.belongsToMany(Phones, {
	through: 'TabletsColors',
	foreignKey: 'colorId',
}); */

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};