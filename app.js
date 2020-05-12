// Budget Controller
const budgetController = (function() {
	const Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	const Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	const calculateTotal = function(type) {
		let sum = data.allItems[type].reduce((total, item) => total + item.value, 0);
		data.totals[type] = sum;
	}
	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	}
	return {
		addItem: function(type, des, val) {
			let newItem, ID;
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0
			}


			if (type === 'exp') {
				newItem = new Expense(ID, des, val)
			} else {
				newItem = new Income(ID, des, val)
			}
			data.allItems[type].push(newItem);
			return newItem;
		},

		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');
			//Calculate the budget
			data.budget = data.totals.inc - data.totals.exp;
			if (data.totals.inc > 0) {
				// Calculate the percentage of income that we spent
				data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
			} else {
				data.percentage = -1;
			}

		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testing: function() {
			console.log(data);
		}


	}

})();

// UI Controller
const uiController = (function() {
	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	}

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, //either expense or income
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			let html, newHtml, element;
			//create html sting with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>
								<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">
								<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
								</div></div></div>`;
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>
								<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>
								<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
								</div></div></div>`;
			}
			//replace placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			// insert html into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function() {
			let fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(field => field.value = '');
			fieldsArr[0].focus();
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};

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

	const updateBudget = function() {
		//1.Calculate the budget
		budgetCtrl.calculateBudget();
		// 2.Return the budget
		budgetCtrl.getBudget();
		//3.Display the budget on the UI
		console.log(budgetCtrl.getBudget());
	}

	const ctrlAddItem = function() {
		let input, newItem;

		//1.Get the field input data
		input = UICtrl.getInput()

		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			//2.Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value)

			//3.Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			//4.Clear the input fields
			UICtrl.clearFields();

			//5.Calculate and update budget
			updateBudget();
		}

	}

	return {
		init: function() {
			console.log('App has started');
			setUpEventListeners();
		}
	}

})(budgetController, uiController);

controller.init();