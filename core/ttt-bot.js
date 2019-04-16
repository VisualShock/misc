let base = require('./ttt-app.js');
const SETTINGS = require('./settings.js');

class TicTacToeBot extends base {
	constructor() {
		super();
	}

	startGame(name, id) {
		let startPromise = super.startGame(name, id);
		let session = this.findProperSession(name, id);

		session.addUser('bot', 'tac');	
		session.currentPlayer = name;
		session.deferred.resolve(session);
		session.defer();

		return startPromise;
	}
	
	waitForMove(name, id) {
		const session = this.findProperSession(name, id);

		if (!session) {
			return Promise.reject('Can\'t find session');
		}

		const moveIndex = this.getBotMoveIndex(session);

		setTimeout(() => this.makeMove('bot', id, moveIndex), 2000);

		return super.waitForMove(name, id);
	}

	getBotMoveIndex(session) {
		const freeIndexes = this.getFreeCells(session.cells);
		const randomValue = Math.floor(Math.random() * freeIndexes.length);
		
		return freeIndexes[randomValue];
	}

	getFreeCells(cells) {
		return cells
			.map((value, index) => {
				if (value === SETTINGS.free) {
					return index;
				}
			})
			.filter(index => index !== undefined);
	}
}

module.exports = new TicTacToeBot;