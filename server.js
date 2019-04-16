require('use-strict');

const express = require('express');
const bodyParser = require('body-parser');
const app = require('./core/ttt-bot.js');
const server = express();

server.use(bodyParser.json());
server.use((request, response, next) => {
	console.log('Request path: ' + request.path);

	next();
});

server.get('/', (request, response) => {
	response.sendFile(__dirname + '/index.html');
});

server.get('/start', (request, response) => {
	const query = request.query;

	handleResponse(app.startGame(query.name, query.id), response);
});

server.post('/makeMove', (request, response) => {
	const body = request.body;

	handleResponse(app.makeMove(body.name, body.id, body.move), response);
});

server.post('/waitMove', (request, response) => {
	const body = request.body;

	handleResponse(app.waitForMove(body.name, body.id), response);
});

server.get('/sessions', (request, response) => {
	response.send(app.getSessions());
});

server.listen(4000, () => {
	console.log('Server is up and listens port: 4000');
});

function handleResponse(promise, response) {
	promise
		.then(onSuccess.bind({}, response))
		.catch(onFail.bind({}, response));
}

function onSuccess(response, data) {
	response.send({ok: true, data: data});
}

function onFail(response, reason) {
	response.send({ok: false, reason: reason});
}