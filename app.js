//Selectors
const buttonsDisplay = document.querySelector('.buttons-display');
const outputBox = document.querySelector('.output');
let clickedNumbers = [];
let rememberMe = [];

//Event Listeners
buttonsDisplay.addEventListener("click", buttonClicked);

//Update outputBox with clickedNumbers
function updateOutput() {
    outputBox.value = clickedNumbers.join('');
}

//Empties the output box and clickedNumbers array
function switchOff() {
    console.log('Switched off');
    outputBox.value = '';
    clickedNumbers = [];
}

//Handles the calculation of the equation
function workOut() {
    if (validateArray(clickedNumbers)) {
        console.log('Worked out');
        let result = calculate(clickedNumbers);
        outputBox.value = result;
        clickedNumbers = result.toString().split('');
    } else{
        switchOff();

    }
}

//Removes the last entry in clickedNumbers
function deleteLast() {
    // Check if there are more items to remove
    if (clickedNumbers.length > 0) {
        // Removes the last operation symbol from clickedNumbers
        clickedNumbers.pop();
    }
    updateOutput();
}

//Resets the calculator
function resetCalc() {
    switchOff();
}

function workOutPercent() {
    if (validateArray(clickedNumbers)) {
        console.log('Worked out percentage');
        let result = calculate(clickedNumbers);
        let percentResult = result / 100;
        outputBox.value = percentResult;
        clickedNumbers = percentResult.toString().split('');
    }
}




//Processes button clicks
function buttonClicked(event) {
    if (event.target.nodeName === 'BUTTON') {
        event.preventDefault();
        const buttonText = event.target.innerText;
        clickedNumbers.push(buttonText);
        updateOutput();

        switch (buttonText) {
            case 'OFF':
                switchOff();
                break;
            case '=':
                workOut();
                break;
            case 'C':
                clickedNumbers.pop();
                deleteLast();
                break;
            case 'AC':
                resetCalc();
                break;
            case '%':
                clickedNumbers.pop();
                workOutPercent();
                console.log('percentage call');
                break;
            case 'MRC':
            case 'M+':
            case 'M-':    
                clickedNumbers.pop();
                updateOutput();
                break;
        }
    }
}






function validateArray(arr) {
    // Join the array elements into a string
    const str = arr.join('');

    // Use a regular expression to match sequences of digits and dots
    // Replace these sequences with a placeholder 'N'
    const replacedStr = str.replace(/\d*\.\d+|\d+/g, 'N');

    // Create a regular expression that describes a valid sequence of placeholders and operators
    // The caret '^' means the string must start with 'N' (a number)
    // The expression 'N' can be followed by any number of operator-number pairs, where an operator is one of '+', '-', '÷', '×'
    // The expression can optionally end with '='
    // The dollar sign '$' means the string must end with 'N' or '='
    const validFormat = /^N([+\-÷×]N)*=?$/;

    // Check if the replaced string matches the regular expression
    const isValidFormat = validFormat.test(replacedStr);

    // Check that each number contains at most one dot
    const isValidDecimals = str.split(/[+\-÷×=]/).every(numStr => {
        return (numStr.match(/\./g) || []).length <= 1;
    });

    // Return true if the format is valid and every number is a valid decimal number
    return isValidFormat && isValidDecimals;
}

function calculate(arr) {
    // Concatenate the array into a single string and remove the ending '='
    const str = arr.join('').replace(/=$/, '');
    
    // Split the string by '+', then map over the parts
    const addParts = str.split('+').map(addPart => {
        // Split the addition part by '-', then map over the parts
        const subtractParts = addPart.split('-').map((subtractPart, index) => {
            // Split the subtraction part by '×', then map over the parts
            const multiplyParts = subtractPart.split('×').map(multiplyPart => {
                // Split the multiplication part by '÷', then reduce it to a single number by dividing
                return multiplyPart.split('÷').reduce((a, b) => Number(a) / Number(b));
            });
            // Reduce the multiplication parts to a single number by multiplying
            return multiplyParts.reduce((a, b) => Number(a) * Number(b));
        });
        // Reduce the subtraction parts to a single number by subtracting, ensure the first part is treated as a positive number
        return subtractParts.reduce((a, b, index) => index !== 0 ? Number(a) - Number(b) : Number(a));
    });
    // Reduce the addition parts to a single number by adding
    return addParts.reduce((a, b) => Number(a) + Number(b));
}



