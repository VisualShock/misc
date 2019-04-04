let template = require('lodash/template');
let viewContext = require.context('../views', true, /\.html$/);
let viewNames = viewContext.keys();

class BaseController {
	constructor(rootElement) {
		this.rootElement = rootElement;
	}

	renderView(viewName, viewModel) {
		let view = getViewByName(viewName);
		let html = template(view)(viewModel);

		this.rootElement.innerHTML = html;
	}
}

function getViewByName(name) {
	let fullName = name.toLowerCase();
	let viewPath;

	let found = viewNames.some(c => {
		viewPath = c;

		return c.indexOf(fullName) !== -1;
	});

	if (found) {
		return viewContext(viewPath);
	}

	return null;
}

module.exports = BaseController;