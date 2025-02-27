function add(a, b) {
    return a + b;
}

function subtract (a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, operator, b) {     
    a = parseFloat(a);
    b = parseFloat(b);
    switch(operator) {
        case '+':
            return add(a, b);
            break;
        case '-': 
            return subtract(a, b);
            break;
        case '*':
            return multiply(a, b);
            break;
        case '/':
            if (b === 0) {
                alert("You cannot divide by 0!");
            }
            return divide(a, b);
            break;
        default:
            alert("No such operation");
            break;
    }    
}

let currOp = ['','','']; // array for storing current operation - two operands and one operator between

const resultDiv = document.querySelector('.result');
const buttons = document.querySelectorAll('button');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');


const numbers = Array.from(buttons)
    .filter(button => /[0-9]/.test(button.textContent));

numbers.forEach(number => number.addEventListener('click', () => addOperand(number.dataset.value)));
operators.forEach(operator => operator.addEventListener('click', () =>
    addOperator(operator.dataset.value)));


//EVALUATE EXPRESSION 
equals.addEventListener('click', evaluateExpression);
operators.forEach(operator => operator.addEventListener('click', evaluateExpression));

function evaluateExpression(btnPressed) {
    if (!currOp.includes('') && currOp.length === 3 && !currOp[2].endsWith('.')) {
        const result = +operate(...currOp).toFixed(4);
        
        if (result === Infinity || result === -Infinity) {
            currOp[2] = '';
        } else { //typical execution        
            //this function can be called by clicking (PointerEvent) or by a key press
            //if expression is evaluated using "=" sign, only the result is shown
            //if it is evaluated using one of four operators "+-*/", the result is shown
            //  alongside with that operator for following operation
            if (btnPressed instanceof PointerEvent) {
                const clickedSign = btnPressed.target.dataset.value;
                if (clickedSign !== "=") {
                    currOp = [result.toString(), clickedSign, ""];
                } else currOp = [result.toString(), "", ""];
            } else {
                if (btnPressed !== "=" && btnPressed !== "Enter") {
                    currOp = [result.toString(), btnPressed, ""];
                } else currOp = [result.toString(), "", ""];
            }
        }
        
        display();
    }
}

function display() {
    let str = resultDiv.textContent;
    str = resultDiv.textContent = currOp.join('').substring(0,22);

    if (str.length === 22) { //trim currOp as well to make sure no 'ghost' characters are accepted (they would have to be deleted by user)
        if (currOp[1]) { 
            const op = str.indexOf(currOp[1]);
            currOp[0] = str.slice(0,op);
            currOp[2] = str.slice(op+1);
        } else {
            currOp[0] = str;
        }
    }

    if (str.includes('/')) resultDiv.textContent = str.replace('/','÷');
    else if (str.includes('*')) resultDiv.textContent = str.replace('*','×');
}


function addOperand(num) {
    if (!currOp[1]) {
        if (currOp[0] === '0' || currOp[0] === '-0') currOp[0] = currOp[0].replace('0', num);
        else currOp[0] += num;
    }
    else {//adds second operand only when operator has been selected 
        if (currOp[2] === '0' || currOp[2] === '-0') currOp[2] = currOp[2].replace('0', num);
        else currOp[2] += num;
    }
    display();    
}

function addOperator(operator) {
    if (currOp[0] && !currOp[1] && !currOp[0].endsWith('.')) {        
        currOp[1] = operator;
        display();
    }
}

//CLEAR
const clearBtn = document.querySelector('.clear');
clearBtn.addEventListener('click', clear);

function clear() {
    currOp = ['','',''];
    resultDiv.textContent = '';
};

//BACKSPACE
const deleteBtn = document.querySelector('.delete');
deleteBtn.addEventListener('click', deleteCharacter);

function deleteCharacter() {
    if (currOp[2]) currOp[2] = currOp[2].slice(0,-1);
    else if (currOp[1]) currOp[1] = '';
    else currOp[0] = currOp[0].slice(0,-1);

    display();
};

//PLUS/MINUS
const plusMinus = document.querySelector('.plus-minus');
plusMinus.addEventListener('click', reverseNumberSign);

function reverseNumberSign() {
    if (currOp[0] && !currOp[1]) {
        if (currOp[0].startsWith('-')) currOp[0] = currOp[0].slice(1);
        else currOp[0] = '-' + currOp[0];
    } else if (!currOp[0]) currOp[0] = '-' + currOp[0];
    else if (currOp[2]) {
        if (currOp[2].startsWith('-')) currOp[2] = currOp[2].slice(1);
        else {
            if (currOp[1] === '-') { //two minuses make a plus
                currOp[1] = '+';
            } else currOp[2] = '-' + currOp[2];    
        }        
    } else if (!currOp[2] && currOp[1]) {
        if (currOp[1] === '-') { 
            currOp[1] = '+';
        } else currOp[2] = '-' + currOp[2];
    }
    

    display();
};

//DECIMALS
const decimal = document.querySelector('.decimal');
decimal.addEventListener('click', addDecimal);

function addDecimal() {
    if (currOp[2] && !currOp[2].includes('.')) {
        currOp[2] += '.';
    }
    else if (currOp[0] && !currOp[1] && !currOp[0].includes('.')) {
        currOp[0] += '.'; 
    }    

    display(); 
}

//DISABLE/ENABLE NUMBERS

function disableNumbers() {
    numbers.forEach(number => number.disabled = true);
}

function enableNumbers() {
    numbers.forEach(number => number.disabled = false);    
}

//KEYBOARD SUPPORT
window.addEventListener("keydown", handleKeyboardInput); // check (e)

function handleKeyboardInput(e) {
    const operators = "+-*/";
    const numbers = "0123456789";
    if (numbers.includes(e.key)) addOperand(e.key);
    else if (operators.includes(e.key)) {
        if (!currOp.includes('') && currOp.length === 3 && !currOp[2].endsWith('.')) evaluateExpression(e.key);
        else addOperator(e.key);
    } else if (e.key === '=' || e.key === 'Enter') evaluateExpression(e.key);
    else if (e.key === 'Backspace') deleteCharacter();
    else if (e.key === 'Delete' || e.key === 'Escape') clear();
    else if (e.key === '.') addDecimal();
    else if (e.key === 'Tab') {
        e.preventDefault();
        reverseNumberSign();
    }
}