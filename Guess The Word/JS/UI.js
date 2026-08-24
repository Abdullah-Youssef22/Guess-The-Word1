import {
    getLevelData
} from "./Storage.js";


/* ========================================
   Screen Management
======================================== */

function selectLevelScreen() {
    const game = document.getElementById("game-section");
    const form = document.getElementById("level-selection");
    const endingBanners = document.querySelectorAll(".ending-banners");

    game.classList.remove("visible");
    game.classList.add("hidden");

    form.classList.remove("hidden");
    form.classList.add("visible");

    endingBanners.forEach((banner) => {
        banner.classList.add("hidden");
        banner.classList.remove("ending-banners");
    });
}

function PlayingScreen() {
    hideHints();

    const game = document.getElementById("game-section");
    const form = document.getElementById("level-selection");
    const endingBanners = document.querySelectorAll(".ending-banners");

    game.classList.remove("hidden");
    game.classList.add("visible");

    form.classList.remove("visible");
    form.classList.add("hidden");

    endingBanners.forEach((banner) => {
        banner.classList.add("hidden");
        banner.classList.remove("ending-banners");
    });
}


/* ========================================
   Input Management
======================================== */

function makeInputsForAWord(word) {
    const attemptsContainer = document.querySelector("#attempts-container");

    attemptsContainer.innerHTML = "";

    for (let attempt = 0; attempt < 10; attempt++) {
        const attemptRow = document.createElement("div");
        attemptRow.classList.add("attempt");

        const label = document.createElement("span");
        label.innerText = `Try: ${attempt + 1}`;

        const inputs = document.createElement("div");
        inputs.classList.add("input-blocks");

        for (let i = 0; i < word.length; i++) {
            const input = document.createElement("input");

            input.classList.add("input");
            input.type = "text";
            input.maxLength = 1;
            input.disabled = attempt !== 0;
            input.dataset.attempt = attempt;
            input.dataset.index = i;
            input.id = `input${attempt + 1}${i + 1}`;

            input.style.cssText = `
                background-color: #222;
                color: #fff;
                box-shadow: 0 0 4px 2px rgba(228, 228, 228, 0.2);
            `;

            inputs.appendChild(input);
        }

        attemptRow.appendChild(label);
        attemptRow.appendChild(inputs);
        attemptRow.style.cssText = "padding: 13px;";

        attemptsContainer.appendChild(attemptRow);
    }

    focusFirstInput();
}

function focusFirstInput() {
    const firstInput = document.querySelector("#attempts-container .attempt:first-child input");

    if (firstInput) {
        firstInput.focus();
        firstInput.classList.add("foucsed-input");
    }
}

function setupInputBehavior() {
    const attemptsContainer = document.querySelector("#attempts-container");

    attemptsContainer.addEventListener("focusin", function (e) {
        if (e.target.tagName !== "INPUT") {
            return;
        }

        document.querySelectorAll(".foucsed-input").forEach((input) => {
            input.classList.remove("foucsed-input");
        });

        e.target.classList.add("foucsed-input");
    });

    attemptsContainer.addEventListener("input",function(e){
        if(e.target.tagName!=="INPUT"){
            return;
        }
        const input = e.target;
        if (input.value!=="") {
            const nextInput = input.nextElementSibling;
            if (nextInput) {
                nextInput.focus();
            }
        }
    });

    attemptsContainer.addEventListener("keydown", function (e) {
        if (e.target.tagName !== "INPUT") {
            return;
        }

        const input = e.target;

        if (e.key === "ArrowRight") {
            e.preventDefault();

            const nextInput = input.nextElementSibling;

            if (nextInput) {
                nextInput.focus();
            }

            return;
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();

            const previousInput = input.previousElementSibling;

            if (previousInput) {
                previousInput.focus();
            }

            return;
        }

        if (e.key === "Backspace") {
            if (input.value === "") {
                e.preventDefault();

                const previousInput = input.previousElementSibling;

                if (previousInput) {
                    previousInput.value = "";
                    previousInput.focus();
                }
            }

            return;
        }
    });
}

function changeAttempt(currentRow) {
    const currentInputs = currentRow.querySelectorAll("input");

    currentInputs.forEach((input) => {
        input.disabled = true;
        input.classList.remove("foucsed-input");
    });

    const nextAttempt = currentRow.nextElementSibling;

    if (nextAttempt) {
        const inputs = nextAttempt.querySelectorAll("input");

        inputs.forEach((input) => {
            input.disabled = false;
        });

        const firstInput = inputs[0];

        firstInput.classList.add("foucsed-input");
        firstInput.focus();
    }

    hideHints();
}

function getAttemptRow(attempt) {
    const attempts = document.querySelectorAll(".attempt");

    return attempts[attempt];
}


/* ========================================
   Progress Management
======================================== */

function displayingProgress(level) {
    const progress = getLevelData(level).Progress;
    let containers;

    switch (level) {
        case "A1":
            containers = document.querySelectorAll(".level-1-progress");
            break;

        case "A2":
            containers = document.querySelectorAll(".level-2-progress");
            break;

        case "B1":
            containers = document.querySelectorAll(".level-3-progress");
            break;

        case "B2":
            containers = document.querySelectorAll(".level-4-progress");
            break;

        default:
            throw new Error(`Invalid level: ${level}`);
    }

    containers.forEach((element) => {
        element.innerText = `${level} progress: ${progress}`;
    });
}

function displayingProgressForAllLevels() {
    displayingProgress("A1");
    displayingProgress("A2");
    displayingProgress("B1");
    displayingProgress("B2");
}


/* ========================================
   Input State
======================================== */

function changeInputState(element, state) {
    switch (state) {
        case 1:
            element.style.cssText = `
                background-color: green;
                color: #fff;
                box-shadow: 0 0 4px 2px rgba(228, 228, 228, 0.2);
            `;
            break;

        case 2:
            element.style.cssText = `
                background-color: rgb(255, 233, 70);
                color: #fff;
                box-shadow: 0 0 4px 2px rgba(228, 228, 228, 0.2);
            `;
            break;

        case 3:
            element.style.cssText = `
                background-color: red;
                color: #fff;
                box-shadow: 0 0 4px 2px rgba(228, 228, 228, 0.2);
            `;
            break;

        default:
            element.style.cssText = `
                background-color: #222;
                color: #fff;
                box-shadow: 0 0 4px 2px rgba(228, 228, 228, 0.2);
            `;
            break;
    }
}


/* ========================================
   Hint Management
======================================== */

function displayNumberOfHints(number) {
    const button = document.querySelector("#hint-btn");

    if (number && Number(number)) {
        button.innerText = `${number} hints`;
    } else {
        button.innerText = "No more hints";
        button.style.cssText = "background-color: #666;";

        button.onmouseover = () => {
            button.style.cssText = `
                filter: brightness(1);
                background-color: #666;
            `;
        };
    }
}

function displayHints() {
    const hintDiv = document.getElementById("hint-div");

    hintDiv.classList.add("hint-div--displayed");
    hintDiv.classList.remove("hidden");
}

function hideHints() {
    const hintDiv = document.getElementById("hint-div");

    hintDiv.classList.add("hidden");
    hintDiv.classList.remove("hint-div--displayed");
}


/* ========================================
   Ending Screens
======================================== */

function displayWinningMassage(word) {
    const winningBanner = document.querySelector("#display-winning");
    const wordElements = document.querySelectorAll(".Display-the-word");

    winningBanner.classList.remove("hidden");
    winningBanner.classList.add("ending-banners");

    displayingProgressForAllLevels();

    wordElements[0].innerText = word;
}

function displayLossingMassage(word) {
    const lossingBanner = document.querySelector("#display-lossing");
    const wordElements = document.querySelectorAll(".Display-the-word");

    lossingBanner.classList.remove("hidden");
    lossingBanner.classList.add("ending-banners");

    displayingProgressForAllLevels();

    wordElements[1].innerText = word;
}


/* ========================================
   Exports
======================================== */

export {
    selectLevelScreen,
    PlayingScreen,
    makeInputsForAWord,
    setupInputBehavior,
    changeAttempt,
    displayingProgressForAllLevels,
    changeInputState,
    displayNumberOfHints,
    getAttemptRow,
    displayWinningMassage,
    displayLossingMassage,
    displayHints
};