// Get the display and buttons 
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clickSound = new Audio('click.mp3');

// Initialize variables
let currentInput = ''; // Stores the current input
let previousInput = ''; // Stores the previous input
let operator = ''; // Stores the selected operator

// Maximum characters allowed in the display
const maxDisplayLength = 10; 

// Add event listeners to buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        clickSound.play();
        const value = button.textContent;

        // Clear the display
        if (value === 'AC') {
            currentInput = '';
            previousInput = '';
            operator = '';
            display.textContent = '0';
        }
        // Delete the last character
        else if (value === 'DEL') {
            if (currentInput !== '') {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            } else if (operator !== '') {
                operator = '';
                updateDisplay();
            } else if (previousInput !== '') {
                previousInput = '';
                display.textContent = '0';
            }
        }
        // Handle operators
        else if (['+', '-', '*', '/', '%'].includes(value)) {
            if (currentInput !== '') {
                if (previousInput !== '' && operator !== '') {
                    previousInput = calculate(previousInput, currentInput, operator);
                } else {
                    previousInput = currentInput;
                }
                operator = value;
                currentInput = '';
                updateDisplay();
            } else if (previousInput !== '') {
                operator = value;
                updateDisplay();
            }
        }
        // Handle equals
        else if (value === '=') {
            if (currentInput !== '' && previousInput !== '' && operator !== '') {
                currentInput = calculate(previousInput, currentInput, operator);
                previousInput = '';
                operator = '';
                updateDisplay();
            }
        }
        // Handle numbers and the decimal point
        else {
            currentInput += value;
            updateDisplay();
        }
    });
});

// Function to update the display with scrolling effect
function updateDisplay() {
    let content = previousInput + operator + currentInput;

    // Apply scrolling effect if content exceeds the maximum display length
    if (content.length > maxDisplayLength) {
        content = content.slice(-maxDisplayLength);
    }

    display.textContent = content || '0'; // Show '0' if content is empty
}

// Function to perform calculations
function calculate(num1, num2, operator) {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    let result;
    if (operator === '+') {
        result = a + b;
    } else if (operator === '-') {
        result = a - b;
    } else if (operator === '*') {
        result = a * b;
    } else if (operator === '/') {
        result = b !== 0 ? a / b : 'Error'; // Avoid division by zero
    } else if (operator === '%') {
        result = a % b;
    }

    if (typeof result === 'number' && result % 1 !== 0) {
        const decimalPlaces = result.toString().split('.')[1]?.length || 0;
        if (decimalPlaces > 3) {
            return result.toFixed(6); // Round to 6 decimal places if more than 3
        }
    }

    return result.toString();
}
