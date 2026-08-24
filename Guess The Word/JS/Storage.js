import { levels } from "./dataJS.js";


/* ========================================
   Local Storage Keys
======================================== */

const Keys = {
    A1AvaliableKey: "A1Avl",
    A2AvaliableKey: "A2Avl",
    B1AvaliableKey: "B1Avl",
    B2AvaliableKey: "B2Avl",
    A1SolvedeKey: "A1Sol",
    A2SolvedeKey: "A2sol",
    B1SolvedeKey: "B1sol",
    B2SolvedeKey: "B2sol"
};

/* ========================================
   Level Data
======================================== */

function getLevel(level) {
    switch (level) {
        case "A1":
            return levels.A1;

        case "A2":
            return levels.A2;

        case "B1":
            return levels.B1;

        case "B2":
            return levels.B2;

        default:
            throw new Error(`Invalid level: ${level}`);
    }
}

function getLevelKeys(level) {
    switch (level) {
        case "A1":
            return {
                AvlKey: Keys.A1AvaliableKey,
                SolKey: Keys.A1SolvedeKey
            };

        case "A2":
            return {
                AvlKey: Keys.A2AvaliableKey,
                SolKey: Keys.A2SolvedeKey
            };

        case "B1":
            return {
                AvlKey: Keys.B1AvaliableKey,
                SolKey: Keys.B1SolvedeKey
            };

        case "B2":
            return {
                AvlKey: Keys.B2AvaliableKey,
                SolKey: Keys.B2SolvedeKey
            };

        default:
            throw new Error(`Invalid level: ${level}`);
    }
}


/* ========================================
   Save Data
======================================== */

function saveAvailableSetToLocalStorage(level, set) {
    const levelKeys = getLevelKeys(level);
    const array = Array.from(set);

    localStorage.setItem(levelKeys.AvlKey, JSON.stringify(array));
}

function saveSolvedSetToLocalStorage(level, set) {
    const levelKeys = getLevelKeys(level);
    const array = Array.from(set);

    localStorage.setItem(levelKeys.SolKey, JSON.stringify(array));
}


/* ========================================
   Load Data
======================================== */

function loadAvailableSetFromLocalStorage(level) {
    const levelKeys = getLevelKeys(level);
    const stored = localStorage.getItem(levelKeys.AvlKey);

    if (stored) {
        try {
            const array = JSON.parse(stored);
            return new Set(array);
        } catch (e) {
            return null;
        }
    }

    return null;
}

function loadSolvedSetFromLocalStorage(level) {
    const levelKeys = getLevelKeys(level);
    const stored = localStorage.getItem(levelKeys.SolKey);

    if (stored) {
        try {
            const array = JSON.parse(stored);
            return new Set(array);
        } catch (e) {
            return null;
        }
    }

    return null;
}


/* ========================================
   Get Sets
======================================== */

function getAvailableSetForLevel(level) {
    const levelData = getLevel(level);
    const storedSet = loadAvailableSetFromLocalStorage(level);

    if (storedSet !== null) {
        return storedSet;
    }

    return new Set(levelData);
}

function getSolvedSetForLevel(level) {
    const storedSet = loadSolvedSetFromLocalStorage(level);

    if (storedSet !== null) {
        return storedSet;
    }

    return new Set();
}

function getSetsForLevel(level) {
    const availableSet = getAvailableSetForLevel(level);
    const solvedSet = getSolvedSetForLevel(level);

    return [availableSet, solvedSet];
}

/* ========================================
   Word Management
======================================== */

function newWordSolved(level, index) {
    const availableWords = Array.from(getAvailableSetForLevel(level));

    if (typeof index !== "number" || !Number.isInteger(index)) {
        throw new TypeError("Index must be an integer");
    }
    if (index < 0 || index >= availableWords.length) {
        throw new Error("Invalid word index");
    }

    const solvedWords = getSolvedSetForLevel(level);
    solvedWords.add(availableWords[index]);
    availableWords.splice(index, 1);
    const availableSet = new Set(availableWords);

    saveAvailableSetToLocalStorage(level, availableSet);
    saveSolvedSetToLocalStorage(level, solvedWords);
}


/* ========================================
   Level Information
======================================== */

function getLevelData(level) {
    const levelSet = getLevel(level);
    const availableSet = getAvailableSetForLevel(level);
    const solvedSet = getSolvedSetForLevel(level);
    const levelSize = levelSet.size;
    const progress = `${solvedSet.size}/${levelSize}`;

    return {
        AVLSet: availableSet,
        SOLSet: solvedSet,
        Progress: progress
    };
}


/* ========================================
   Reset
======================================== */

function resetLevel(level) {
    const levelSet = getLevel(level);

    saveAvailableSetToLocalStorage(level, levelSet);
    saveSolvedSetToLocalStorage(level, new Set());
}

function resetAllLevels() {
    resetLevel("A1");
    resetLevel("A2");
    resetLevel("B1");
    resetLevel("B2");
}


/* ========================================
   Exports
======================================== */

export {
    getLevelData,
    newWordSolved,
    resetLevel,
    resetAllLevels
};