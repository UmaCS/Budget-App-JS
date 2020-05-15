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

		deleteItem: function(type, id) {
			// let ids, index;
			// ids = data.allItems[type].map(item => item.id);
			// index = ids.indexOf(id);
			// if (index !== -1) {
			// 	data.allItems[type].splice(index, 1);
			// }
			// let ids;
			// ids = data.allItems[type]
			console.log(data.allItems);
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
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
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

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	}

	const updateBudget = function() {
		//1.Calculate the budget
		budgetCtrl.calculateBudget();
		// 2.Return the budget
		let budget = budgetCtrl.getBudget();
		//3.Display the budget on the UI
		UICtrl.displayBudget(budget);
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

	};

	const ctrlDeleteItem = function(event) {
		let itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			//2. Delete the item from the UI

			// 3. Update and show the new budget
		}

	}

	return {
		init: function() {
			setUpEventListeners();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		}
	}

})(budgetController, uiController);

controller.init();