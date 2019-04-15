let sessions = require('./sessions.json').sessions;
const uid = require('uniqid');
const SETTINGS = {
	free: 0,
	tic: 1,
	tac: 2,
	ttl: 300000,
	maxSessionCount: 200
};

class TicTacToe {
	startGame(name, id) {
		let session = this.findProperSession(name, id);

		if (!session) {
			session = this.createNewSession(name);
		} else {
			this.tryAddUser(session, name);
		}

		if (session.users.length === 2) {
			const randomIndex = Math.floor(Math.random() + 0.5);

			session.currentPlayer = session.users[randomIndex].name;
			session.resolve(session);
		}

		return session.promise;
	}

	findProperSession(name, id) {
		const self = this;
		let session;

		if (id) {
			session = sessions.filter(session => {
				return session.id === id && self.getUser(session, name);
			});
		} else {
			session = sessions.filter(session => {
				return session.users.length === 1;
			});
		}

		return session[0];
	}

	createNewSession(name) {
		const session = {
			id: uid(),
			users: [{name: name, mark: 'tic'}],
			cells: [0,0,0,0,0,0,0,0,0],
			timestamp: Date.now()
		};

		if (sessions.length >= SETTINGS.maxSessionCount) {
			sessions.shift();
		}

		session.promise = new Promise((resolve, reject) => {
			session.resolve = resolve;
		});
		
		this.cleanExpiredSessions();
		sessions.push(session);

		return session;
	}

	cleanExpiredSessions() {
		sessions = sessions.filter(session => {
			return Date.now() - session.timestamp <= SETTINGS.ttl;
		});
	}

	tryAddUser(session, name) {
		const user = this.getUser(session, name);

		if (!user) {
			session.users.push({
				name: name,
				mark: 'tac'
			});
		}
	}

	makeMove(name, id, move) {
		const session = this.findProperSession(name, id);
		const user = this.getUser(session, name);
		const opponent = this.getOpponent(session, name);

		if (session.currentPlayer !== user.name) {
			return Promise.reject('Not your turn!');
		}

		if (session.cells[move] !== SETTINGS.free) {
			return Promise.reject('Wrong move, choose another cell');
		}

		session.cells[move] = SETTINGS[user.mark];
		session.currentPlayer = opponent.name;

		return Promise.resolve(1);
	}

	getUser(session, name) {
		return session.users.filter(user => {
			return user.name === name;
		})[0];
	}

	getOpponent(session, name) {
		return session.users.filter(user => {
			return user.name !== name;
		})[0];
	}

	getSessions() {
		return sessions;
	}
}


class Session {
	constructor() {

	}

	resolve() {

	}
}

module.exports = new TicTacToe;