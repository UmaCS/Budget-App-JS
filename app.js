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

	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
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
				addListItem: function(obj, type) {
					let html, newHtml;
					//create html sting with placeholder text
					if (type === 'inc') {
						html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>
								<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">
								<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
								</div></div></div>`;
					} else if (type === 'exp') {
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
				let input, newItem;

				//1.Get the field input data
				input = UICtrl.getInput()

				//2.Add the item to the budget controller
				newItem = budgetCtrl.addItem(input.type, input.description, input.value)

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