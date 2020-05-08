// Budget Controller
const budgetController = (function() {


})();

// UI Controller
const uiController = (function() {
	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	}

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, //either expense or income
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	}

})();

// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

	const setUpEventListeners = function() {
		let DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', e => {
			if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
		});
	}

	const ctrlAddItem = function() {
		//1.Get the field input data
		let input = UICtrl.getInput()
		console.log(input);

		//2.Add the item to the budget controller

		//3.Add the item to the UI

		//4.Calculate the budget

		//5.Display the budget on the UI
	}
	return {
		init: function() {
			console.log('App has started');
			setUpEventListeners();
		}
	}

})(budgetController, uiController);

controller.init();