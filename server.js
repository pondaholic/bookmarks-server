const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Bookmark } = require('./model');

const app = express();
app.use(express.json);
app.use(morgan('dev'));

app.get('*', (req, res) => {
	res.send('ok');
});

app.post('/api/bookmark', (req, res) => {
	const requiredFields = ['url', 'name', 'rating'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Please enter a ${field}`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Bookmark.create({
		name: req.body.name,
		url: req.body.url,
		description: req.body.description,
		rating: req.body.rating
	})
		.then(bookmark => res.status(201).json(bookmark.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		});
});

app.use('*', function(req, res) {
	res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			databaseUrl,
			err => {
				if (err) {
					return reject(err);
				}
				server = app
					.listen(port, () => {
						console.log(`Your app is listening on port ${port}`);
						resolve();
					})
					.on('error', err => {
						mongoose.disconnect();
						reject(err);
					});
			}
		);
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
