//  ELEMENTS
const passLengthSlider = document.querySelector("[data-lengthSlider]");
const dataLengthNumber = document.querySelector("[data-lengthNumber]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const st = document.querySelector("#data-indicator");
const genBtn = document.querySelector(".generateButton");
const input = document.querySelector("[data-passwordDisplay]");
const copy = document.querySelector("[data-copy]");
const copuMsg = document.querySelector("[data-copyMsg]");
const icon = document.querySelector("#icon");

//VARIABLES 
// let passLength = 10;
let upper = true;
let lower = false;
let numbers = false;
let symbols = false;

//set default checkbox
uppercase.checked = upper;


//RANDOM HELPER
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUpperCase() { return String.fromCharCode(random(65, 90)); }
function randomLowerCase() { return String.fromCharCode(random(97, 122)); }
function randomNumber() { return random(0, 9); }
function randomSymbol() { return String.fromCharCode(random(33, 47)); }


//CHECKBOX BINDING
function bindCheckBox(checkbox, updateVar) {
    checkbox.addEventListener("change", () => {
        updateVar(checkbox.checked);
        strengthCal();
    });
}

bindCheckBox(uppercase, val => upper = val);
bindCheckBox(lowercase, val => lower = val);
bindCheckBox(numbersCheck, val => numbers = val);
bindCheckBox(symbolsCheck, val => symbols = val);


//SLIDER
function updateSlider() {
    dataLengthNumber.textContent = passLengthSlider.value;
    passLength = Number(passLengthSlider.value);
    strengthCal();
}

passLengthSlider.addEventListener("input", updateSlider);
updateSlider();


//STRENGTH INDICATOR
function strengthCal() {
    const allSelected = upper && lower && numbers && symbols;

    let color = "gray";

    if (passLength > 6 && allSelected) color = "green";
    else if ((upper || lower) && (numbers || symbols)) color = "yellow";

    st.style.backgroundColor = color;
}


// PASSWORD GENERATION 
function shuffleString(str) {
    return [...str].sort(() => Math.random() - 0.5).join("");
}

genBtn.addEventListener("click", () => {

    const options = [];
    if (upper) options.push(randomUpperCase);
    if (lower) options.push(randomLowerCase);
    if (numbers) options.push(randomNumber);
    if (symbols) options.push(randomSymbol);

    // Set minimum length equal to number of selected types
    if (options.length > passLength) {
        passLength = options.length;
        passLengthSlider.value = passLength;
        dataLengthNumber.textContent = passLength;
    }

    let password = "";

    // First add at least one of each selected type
    options.forEach(func => password += func());

    // Fill remaining random characters
    while (password.length < passLength) {
        const randomFunc = options[random(0, options.length - 1)];
        password += randomFunc();
    }

    password = shuffleString(password);

    input.value = password;
    icon.style.opacity=1
    icon.style.pointerEvents = "auto";
});


// COPY FUNCTION
async function copyPassword() {
    try {
        await navigator.clipboard.writeText(input.value);

        copuMsg.innerText = "copied";
        copuMsg.style.opacity = 1;

        setTimeout(() => {
            copuMsg.innerText = "";
            copuMsg.style.opacity = 0;
        }, 2000);

    } catch (err) {
        console.error("Failed to copy", err);
    }
}

copy.addEventListener("click", copyPassword);
