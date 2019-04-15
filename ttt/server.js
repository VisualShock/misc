const express = require('express');
const bodyParser = require('body-parser');
const app = require('./ttt-app.js');
const server = express();

server.use(bodyParser.json());
server.use((request, response, next) => {
	console.log('Request path: ' + request.path);

	next();
});

server.get('/', (request, response) => {
});

server.get('/start', (request, response) => {
	const query = request.query;

	if (!query.name) {
		response.send({ok: false});

		return;
	}

	app.startGame(query.name, query.id)
		.then((session) => {
			response.send({ok: true, data: {
				id: session.id,
				isTurn: session.currentPlayer === query.name
			}});
		})
		.catch(() => {
			response.send({ok: false, reason: 'Something went wrong!'});
		});
});

server.get('/makeMove', (request, response) => {
	const query = request.query;

	app.makeMove(query.name, query.id, query.move)
		.then(() => {
			response.send({ok: true, data: 123});
		})
		.catch((reason) => {
			response.send({ok: false, reason: reason});
		});
});

server.get('/sessions', (request, response) => {
	response.send(app.getSessions());
});

server.listen(4000, () => {
	console.log('Server is up and listens port: 4000');
});