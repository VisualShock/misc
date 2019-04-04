let context = require.context('./controllers', true, /\.js$/);
let names = context.keys();

class App {
	static start() {
		let elements = document.querySelectorAll('[data-controller]');

		elements.forEach((el) => {
			let controllerName = el.dataset.controller;
			let controller = getControllerByName(controllerName);

			if (controller !== null) {
				new controller(el);
			}
		});
	}
}

function getControllerByName(name) {
	let fullName = name.toLowerCase() + 'Controller';
	let controllerPath;

	let found = names.some(c => {
		controllerPath = c;

		return c.indexOf(fullName) !== -1;
	});

	if (found) {
		return context(controllerPath);
	}

	return null;
}

window.addEventListener('load', () => App.start());