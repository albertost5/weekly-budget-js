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
}

class UI {
    printBudget( budgetObj ) {
        const { remaining , budget } = budgetObj;
        document.querySelector('span#budget').textContent = budget;
        document.querySelector('span#remaining').textContent = remaining;
    }
    
    showMessage( message, type = 'error' ) {
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
            
            userInterface.printBudget(budget)
        }
    } else {
        // NaN / null // ''
        window.location.reload();
    }
}

function addExpense( e ) {
    e.preventDefault();

    const expenseInput = document.querySelector('#expense').value.trim();
    const quantityInput = document.querySelector('#quantity').value.trim();
    let message;
    
    if( !expenseInput || !quantityInput ||  quantityInput <= 0 ) {
        quantityInput <= 0 ? message = 'Quantity not valid.' : message = 'All the fields are required.';
        
        userInterface.showMessage(message); 
        
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);

        return;
    }

    console.log('Add expense');
}


eventListeners();