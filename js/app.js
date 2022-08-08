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

    newExpense( expense ) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        const totalExpenses = this.expenses.reduce( ( total, expense) => total + expense.quantity, 0 );

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

            expenseLi.appendChild( deleteBtn );
            expensesList.appendChild( expenseLi );
        });
    }

    clearExpensesList() {
        expensesList.textContent = '';
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
    
    // Print success message
    userInterface.showMessage('Expense added');
    
    const { expenses, remaining } = budget;

    // Print expenses
    userInterface.printExpenses( expenses ); 
    
    // Update remaining
    userInterface.updateRemaining( remaining );

    // Form restart
    form.reset();
}


eventListeners();