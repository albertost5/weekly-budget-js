// HTML ELEMENTS
const form = document.querySelector('#add-expense');
const expensesList = document.querySelector('#expenses ul');

let budget;

// CLASSES
class Budget {
    
    constructor( budget ) {
        this.budget = budget;
        this.remaining = budget;
        this.expenses = [];
    }

    get totalExpenses () {
        return this.expenses.reduce( ( total, expense) => total + expense.quantity, 0 );
    }

    newExpense( expense ) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        const totalExpenses = this.totalExpenses;

        this.remaining = this.budget - totalExpenses;
        
        return this.remaining;
    }
}

class UI {
    printBudget( budgetObj ) {
        const { remaining , budget } = budgetObj;
        document.querySelector('span#budget').textContent = budget;
        document.querySelector('span#remaining').textContent = remaining;
    }

    updateRemaining( remaining ) {
        document.querySelector('span#remaining').textContent = remaining;
    }
    
    showMessage( message, type = 'success' ) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.classList.add('text-center', 'alert');
        messageDiv.setAttribute('id', 'message');

        if( type === 'error' ) {
            messageDiv.classList.add('alert-danger');
        } else {
            messageDiv.classList.add('alert-success');
        }

        document.querySelector('.primary').insertBefore( messageDiv, form );
    }

    printExpenses( expensesArr ) {
        this.clearExpensesList();

        expensesArr.forEach( exp  => {
            
            const { name, quantity, id } = exp;
            
            const expenseLi = document.createElement('li');
            expenseLi.textContent = `${name} - ${quantity} - ${id}`
            expenseLi.className = 'list-group-item d-flex justify-content-between align-items-center'
            expenseLi.dataset.id = id;
            
            expenseLi.innerHTML = `${ name } <span class="badge badge-primary badge-pill">$ ${ quantity }</span>` 
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'delete-expense');
            deleteBtn.textContent = 'Remove';
            deleteBtn.onclick = () => {
                deleteExpense( id );
            }

            expenseLi.appendChild( deleteBtn );
            expensesList.appendChild( expenseLi );
        });
    }

    clearExpensesList() {
        expensesList.textContent = '';
    }

    checkRemaining( budget ) {
        const { remaining } = budget;
        const initBudget = budget.budget;
        
        const remainingDiv = document.querySelector('.remaining');

        if( initBudget / 2 >= remaining ) {
            remainingDiv.classList.remove('alert-success');
            // 75%
            if( initBudget / 4 >= remaining ) {
                remainingDiv.classList.remove('alert-warning');
                remainingDiv.classList.add('alert-danger');
                return;
            }

            remainingDiv.classList.add('alert-warning');
        } else {
            if( remainingDiv.classList.contains('alert-warning') ){
                remainingDiv.classList.remove('alert-warning');
            } else if ( remainingDiv.classList.contains('alert-danger') ) {
                remainingDiv.classList.remove('alert-danger');
            } 

            const messageDivSet = document.querySelector('#message');

            if( messageDivSet ) {
                messageDivSet.remove();
                form.querySelector('button').disabled = false;
            } 

            remainingDiv.classList.add('alert-success');
        }
    }
}

const userInterface = new UI();

// EVENTS
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
    form.addEventListener('submit', addExpense);
}

// FUNCTIONS
function askBudget() {
    let userBudget = prompt('What is your budget?');
    
    // Budget validation
    if( /^[1-9]\d*(\.\d+)?$/.test( userBudget ) ) {
        if( userBudget < 0 ){
            window.location.reload();
        } else {
            // Create budget object and add to html
            userBudget = Number.parseFloat( userBudget );
            budget = new Budget( userBudget );
            
            userInterface.printBudget( budget )
        }
    } else {
        // NaN / null // ''
        window.location.reload();
    }
}

function addExpense( e ) {
    e.preventDefault();

    const name = document.querySelector('#expense').value.trim();
    const quantity = Number( document.querySelector('#quantity').value.trim() );

    let message;
    
    if( !name || !quantity || quantity <= 0 || isNaN( quantity ) ) {
        quantity <= 0 || isNaN( quantity ) ? message = 'Quantity not valid.' : message = 'All the fields are required.';
        userInterface.showMessage(message, 'error'); 
        
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);

        return;
    }

    // Create expense
    const expense = { 
        name, 
        quantity, 
        id: Date.now() 
    }

    budget.newExpense( expense );

    const { expenses, remaining } = budget;

    if( budget.totalExpenses <= budget.budget ) {
        // Print success message
        userInterface.showMessage('Expense added');
        setTimeout(() => {
            document.querySelector('.alert-success').remove();
        }, 3000);
        // Update remaining
        userInterface.updateRemaining( remaining );
        // Print expenses
        userInterface.printExpenses( expenses ); 
        // Update the remainig color 
        userInterface.checkRemaining( budget );
        if( budget.totalExpenses === budget.budget ) {
            userInterface.showMessage('All set.', 'error');
            form.querySelector('button').disabled = true;
        } 
    } else {
        userInterface.showMessage('You would exceed the budget..', 'error');
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);
    }

    // Form restart
    form.reset();
}

// Delete expense, update remaining and html
function deleteExpense( idExpense ) {
    budget.expenses = budget.expenses.filter( exp => exp.id != idExpense);
    
    userInterface.updateRemaining( budget.calculateRemaining() );

    userInterface.printExpenses( budget.expenses );
    userInterface.checkRemaining( budget ); 
}


eventListeners();