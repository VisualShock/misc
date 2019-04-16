const uid = require('uuid');
const SETTINGS = require('./settings.js');

class Session {
    constructor(name) {
        this.id = uid();
        this.users = [];
        this.cells = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        this.moves = 0;
        this.timestamp = Date.now();
        this.deferred = defer();
        this.currentPlayer = '';

        this.addUser(name, 'tic');
    }
    
    update(moveIndex) {
        if (moveIndex !== undefined) {
            this.moves++;
            this.cells[moveIndex] = this.getCurrentPlayer().mark;
            this.switchCurrentPlayer();
        }

        this.timestamp = Date.now();
    }

    getUserByIndex(index) {
        return this.users[index];
    }

    getUserByName(name) {
        return this.users.filter(user => {
			return user.name === name;
		})[0]; 
    }

    getDifferentUser() {
        const name = this.currentPlayer;

        return this.users.filter(user => {
			return user.name !== name;
		})[0]; 
    }

    addUser(name, mark) {
        this.users.push({name: name, mark: SETTINGS[mark]});
    }

    tryAddUser(name, mark) {
        const user = this.getUserByName(name);

		if (!user) {
			this.addUser(name, mark)
		}
    }

    getCurrentPlayer() {
        return this.getUserByName(this.currentPlayer);
    }

    switchCurrentPlayer() {
        const user = this.getDifferentUser();

        this.currentPlayer = user.name;

        return user;
    }

    isValidMove(moveIndex) {
        return this.cells[moveIndex] === SETTINGS.free;
    }

    appointCurrentPlayer() {
        const randomIndex = Math.floor(Math.random() + 0.5);
		
		this.currentPlayer = this.getUserByIndex(randomIndex).name;
    }

    defer() {
        this.deferred = defer();
    }

    cellsToPatterns() {
        const cells = this.cells;

        return [
			cells.slice(0,3).join(''),
			cells.slice(3,6).join(''),
			cells.slice(6).join(''),
			[cells[0], cells[3], cells[6]].join(''),
			[cells[1], cells[4], cells[7]].join(''),
            [cells[2], cells[5], cells[8]].join(''),
            [cells[0], cells[4], cells[8]].join(''),
            [cells[2], cells[4], cells[6]].join('')
		]
    }
}

function defer() {
    const deferred = {
        promise: null,
        resolve: null,
        reject: null
    }

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

module.exports = Session;