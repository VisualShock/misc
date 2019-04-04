let BaseController = require('./baseController.js');
let model = require('../models/profileModel.js');

class ProfileController extends BaseController {
	constructor(rootElement) {
		super(rootElement);

		this.index();
	}

	index() {
		let viewModel = Object.assign(model);

		viewModel.fullName = model.firstName + ' ' + model.lastName;

		this.renderView('profile', viewModel);
	}
}

module.exports = ProfileController;