// Selecting The Variables
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// String For Symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// Initital Values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// Changing values of length display WRT to slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // Below Part Is For Styling OF Slider As Color Of SLider Should Change While Moving Slider
    // Left Part Of SliderThumb Fills With Color Whereas Right Part Remains Empty
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// Setting Color Of Strength Indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Getting Random Integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generating Random Number
function generateRandomNumber() {
    return getRndInteger(0,9);
}

// Generating LowerCase Alphabets By Using string.charcode method
// charcode accepts the number as ASCII Values and Convert it to their respective alphabets
function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}
// Generating uppercase Letters same as Lowercase
function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}
// Generating symbols From Our Created String 
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Calculation Of Strength
function calcStrength() {
    // Assuming Nothing Has Been Checked
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    // Checking Using .checked method
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    
    // Condition For Checking Strength Which Will IN Return Update The Color Of Indicator
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// Function to Copy Content To Users Clipboard
async function copyContent() {
    try {
        // This Is An API To Copy To Clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    
    // To Display The Text "Copied"
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

// Shuffling The Password 
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //Random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //Swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// Getting The CheckBox Count
function handleCheckBoxChange() {

    checkCount = 0;

    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // Special Condition 
    // If 4 CheckBox Are Selected And Password Length Is Less Than
    // 4 It Will Cause An Error
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event Listener For Checking Of Checked TickBoxes
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// Event Listener To Change Password Length When Moving Input Slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// Event Listener For Copy Button
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

// Main Part For Generating Password
generateBtn.addEventListener('click', () => {

    //None of the checkbox are selected
    if(checkCount == 0) 
        return;
    // Special Case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Removing The Old Password
    password = "";

    // Declaring Array To Store Function ho Generate Values Randomly
    let funcArr = [];
    // Storing function According To Check Boxes Selected
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        // Since Functions Are Stored We Use () To Execute IT
        password += funcArr[i]();
    }

    //Once All Characters Are Included Proceeding Remaining Addition
    for(let i=0; i < (passwordLength-funcArr.length); i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    //Shuffle the password
    password = shufflePassword(Array.from(password));

    //Display in UI
    passwordDisplay.value = password;

    //Calculate strength
    calcStrength();
});