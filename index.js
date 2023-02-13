const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const loadDb = require('./src/controllers/loadDB.js');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
	loadDb();
	server.listen(process.env.PORT || 3001, () => {
		console.log('%s listening at 3001'); // eslint-disable-line no-console
	});
});
