import {
    getLevelData,
    newWordSolved,
    resetLevel,
    resetAllLevels
} from "./Storage.js";

import {
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
} from "./UI.js";


/* ========================================
   Game State
======================================== */

let currentLevel = null;
let selectedLevel = null;
let currentWord = null;
let currentAttempt = 0;
let hints = 3;
let indexGolbal = -1;
let wordForHint = null;
let isWordAvailable = true;


/* ========================================
   Word Management
======================================== */

function randomWord(level) {
    const levelData = getLevelData(level);
    let avlArr;

    if (levelData.AVLSet.size !== 0) {
        avlArr = Array.from(levelData.AVLSet);
    } else {
        avlArr = Array.from(levelData.SOLSet);
        isWordAvailable = false;
    }

    const index = Math.floor(Math.random() * avlArr.length);
    indexGolbal = index;
    return avlArr[index];
}


/* ========================================
   Round Management
======================================== */

function startRound(level) {
    currentLevel = level;
    currentWord = randomWord(level);
    wordForHint = currentWord.split("");
    currentAttempt = 0;
    hints = 3;

    PlayingScreen();
    makeInputsForAWord(currentWord);
    displayNumberOfHints(hints);
    displayingProgressForAllLevels();
}

function finishRound() {
    currentLevel = null;
    currentWord = null;
    currentAttempt = 0;
    hints = 3;
}


/* ========================================
   Word Checking
======================================== */

function checkLetter(element, index, word) {
    if (element.value.toUpperCase() === word[index].toUpperCase()) {
        return 1;
    }
    if (word.toUpperCase().includes(element.value.toUpperCase())) {
        return 2;
    }
    return 3;
}

function checkWord(row, word) {
    const inputs = row.querySelectorAll("input");
    let valid = true;

    for (let i = 0; i < inputs.length; i++) {
        const state = checkLetter(inputs[i], i, word);
        changeInputState(inputs[i], state);
        if (state !== 1) {
            valid = false;
        }
    }

    return valid;
}

function isAttemptComplete(row) {
    const inputs = row.querySelectorAll("input");
    for (const input of inputs) {
        if (input.value.trim() === "") {
            return false;
        }
    }
    return true;
}

function checkCurrentAttempt() {
    const currentRow = getAttemptRow(currentAttempt);

    if (!isAttemptComplete(currentRow)) {
        return;
    }

    const won = checkWord(currentRow, currentWord);

    if (won) {
        console.log("WIN");

        if (isWordAvailable) {
            newWordSolved(currentLevel, indexGolbal);
        }
        displayWinningMassage(currentWord);
        finishRound();

        const playAgainButton = document.querySelectorAll(".play-again")[0];

        playAgainButton.addEventListener("click", function () {
            startgame();
        });
        return;
    }

    if (currentAttempt < 9) {
        currentAttempt++;
        changeAttempt(currentRow);
        return;
    }

    console.log("LOSE");

    displayLossingMassage(currentWord);
    finishRound();

    const playAgainButton = document.querySelectorAll(".play-again")[1];

    playAgainButton.addEventListener("click", function () {
        startgame();
    });
}


/* ========================================
   Game Events
======================================== */

function setupGameEvents() {
    const checkButton = document.querySelector(".check");

    checkButton.addEventListener("click", function () {
        checkCurrentAttempt();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") {
            return;
        }
        if (currentLevel === null) {
            return;
        }
        const activeElement = document.activeElement;
        if (!activeElement.classList.contains("input")) {
            return;
        }
        checkCurrentAttempt();
    });
}


/* ========================================
   Level Selection
======================================== */

function setUpLevelSelection() {
    const levelButtons = document.querySelectorAll(".from__btn:not(#submit-level-form)");

    levelButtons.forEach((button) => {
        button.addEventListener("click", function () {
            selectedLevel = this.value;
        });
    });
}

function setUpLevelForm() {
    const form = document.getElementById("level-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (selectedLevel === null) {
            alert("Please select a level first.");
            return;
        }
        startRound(selectedLevel);
    });
}


/* ========================================
   Hints
======================================== */

function useHints() {
    const hintButton = document.getElementById("hint-btn");

    hintButton.addEventListener("click", function () {
        if (hints > 0) {
            const hintDiv = document.getElementById("hint-div");
            const index = Math.floor(Math.random() * wordForHint.length);
            const hint = wordForHint[index].toUpperCase();
            wordForHint.splice(index, 1);
            hintDiv.innerText = `The word contains the letter (${hint})`;
            displayHints();
            hints--;
            displayNumberOfHints(hints);
        }
    });
}

/* ========================================
   Reseting Buttons
======================================== */

function resetingBtns() {
    const resetA1 = document.getElementById("reset-level-1");
    const resetA2 = document.getElementById("reset-level-2");
    const resetB1 = document.getElementById("reset-level-3");
    const resetB2 = document.getElementById("reset-level-4");
    const resetAll = document.getElementById("reset-all-levels");
    resetA1.addEventListener("click", function () {
        resetLevel("A1")
        displayingProgressForAllLevels();
    });
    resetA2.addEventListener("click", function () {
        resetLevel("A2")
        displayingProgressForAllLevels();
    });
    resetB1.addEventListener("click", function () {
        resetLevel("B1")
        displayingProgressForAllLevels();
    });
    resetB2.addEventListener("click", function () {
        resetLevel("B2")
        displayingProgressForAllLevels();
    });
    resetAll.addEventListener("click", function (e) {
        e.preventDefault();
        resetAllLevels();
        displayingProgressForAllLevels();
    });
}


/* ========================================
   Application Start
======================================== */

function intialization(){
    useHints();
    setupGameEvents();
    resetingBtns();
    setupInputBehavior();
    setUpLevelSelection();
    setUpLevelForm();
}

function startgame() {
    selectLevelScreen();
    displayingProgressForAllLevels();
}

export {
    intialization,
    startgame
};