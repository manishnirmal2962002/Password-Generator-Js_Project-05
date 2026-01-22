// DOM Elements
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


const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 10;
let checkCount = 0;


handleSlider();
// setIndicator("#ccc");

// ========================
// Utility Functions
// ========================

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10).toString();
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}


function generateSymbol() {
  return symbols.charAt(getRndInteger(0, symbols.length));
}

function calcStrength() {
  const hasUpper = uppercaseCheck.checked;
  const hasLower = lowercaseCheck.checked;
  const hasNum = numbersCheck.checked;
  const hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // strong - green
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0"); // medium - yellow
  } else {
    setIndicator("#f00"); // weak - red
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 1000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// ========================
// Event Handlers
// ========================

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach(checkbox => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// Attach checkbox listeners
allCheckBox.forEach(checkbox => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// Slider listener
inputSlider.addEventListener("input", e => {
  passwordLength = e.target.value;
  handleSlider();
});

// Copy password listener
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// Generate password listener
generateBtn.addEventListener("click", () => {
  // If no checkbox selected
  if (checkCount == 0) 
    return;

  // If length < number of selected checkboxes
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Start password generation
  password = "";

  let funcArr = [];
  if (uppercaseCheck && uppercaseCheck.checked) funcArr.push(generateUpperCase);
if (lowercaseCheck && lowercaseCheck.checked) funcArr.push(generateLowerCase);
if (numbersCheck && numbersCheck.checked)     funcArr.push(generateRandomNumber);
if (symbolsCheck && symbolsCheck.checked)     funcArr.push(generateSymbol);
  // Add one character from each selected type
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Add remaining characters randomly
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex"+ randIndex);
    password += funcArr[randIndex]();
  }

  // Shuffle the password
  password = shufflePassword(Array.from(password));

  // Show in UI
  passwordDisplay.value = password;

  // Evaluate strength
  calcStrength();
});