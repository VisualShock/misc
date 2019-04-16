const SETTINGS = require('./settings.js');
const Session = require('./session.js');

class SessionCollection extends Array {
	constructor() {
		super();

		setInterval(this.cleanExpired.bind(this), 5 * 60 * 1000);
	}

	createNew(name) {
		const session = new Session(name);

		if (this.length >= SETTINGS.maxSessionCount) {
			this.shift();
		}

		this.cleanExpired();
		this.push(session);

		return session;
	}

	cleanExpired() {
		for (let i = 0; i < this.length; i++) {
			if (Date.now() - this[i].timestamp > SETTINGS.ttl) {
				this.splice(i, 1);
				i--;
			}
		}
	}

	getByNameAndId(name, id) {
		return this.getBy(session => {
			return session.id === id && session.getUserByName(name);
		});
	}

	getWithOnlyOneUser() {
		return this.getBy(session => {
			return session.users.length === 1;
		});
	}

	getBy(expression) {
		return this.filter(expression)[0];
	}

	remove(session) {
		const index = this.indexOf(session);

		this.splice(index, 1);
	}
}

module.exports = SessionCollection;