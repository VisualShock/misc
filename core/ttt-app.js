const SETTINGS = require('./settings.js');
const SessionCollection = require('./sessionCollection.js');

let sessions = new SessionCollection();

class TicTacToe {
	startGame(name, id) {
		if (!name) {
			return Promise.reject('Name is obligatory!');
		}

		let session = this.findProperSession(name, id);

		if (!session) {
			session = sessions.createNew(name);
		} else {
			session.tryAddUser(name, 'tac');
		}

		return this.processSession(session, name);
	}

	processSession(session, name) {
		const startPromise = session.deferred.promise;

		if (session.users.length === 2) {
			session.appointCurrentPlayer();		
			session.deferred.resolve(session);
			session.defer();
		}

		return startPromise.then(session => {
			return {
				id: session.id,
				canMove: name === session.currentPlayer
			}
		});
	}

	findProperSession(name, id) {
		return id
			? sessions.getByNameAndId(name, id)
			: sessions.getWithOnlyOneUser();
	}

	makeMove(name, id, move) {
		const session = this.findProperSession(name, id);

		if (!session) {
			return Promise.reject('Can\'t find session');
		}

		if (session.getCurrentPlayer().name !== name) {
			return Promise.reject('Not your turn!');
		}

		if (!session.isValidMove(move)) {
			return Promise.reject('Wrong move, choose another cell');
		}

		session.update(move);

		const result = this.checkWinner(session, name, move);
		
		session.deferred.resolve(result);
		session.defer();

		return Promise.resolve(result);
	}

	waitForMove(name, id) {
		const session = this.findProperSession(name, id);

		if (!session) {
			return Promise.reject('Can\'t find session');
		}

		if (session.currentPlayer === name) {
			return Promise.reject('Your move now');
		}

		return session.deferred.promise
				.then(this.processResult);
	}

	getSessions() {
		return sessions;
	}

	checkWinner(session, name, move) {
		const result = { move: move };

		if (session.moves < 5) {
			return result;
		}

		const patterns = session.cellsToPatterns();
		const mark = session.getUserByName(name).mark;

		result.win =    this.testPatterns(mark, patterns, SETTINGS.win)
					 || this.testPatterns(+!mark, patterns, SETTINGS.lose)
					 || (session.moves === 9 && SETTINGS.draw)
					 || undefined;

		if (result.win !== undefined) {
			sessions.remove(session);
		}

		return result;
	}

	testPatterns(mark, patterns, sign) {
		let testPattern = [mark, mark, mark].join('');

		return patterns.indexOf(testPattern) !== -1
			? sign
			: undefined;
	}

	processResult(result) {
		const processed = Object.assign({}, result);

		if (processed.win === SETTINGS.win) {
			processed.win = SETTINGS.lose
		} else if (processed.win === SETTINGS.lose) {
			processed.win = SETTINGS.win;
		}

		return processed;
	}
}

module.exports = TicTacToe;