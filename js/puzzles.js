// ================================
// RANDOM PUZZLE GENERATOR
// ================================

function generateRandomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ================================
// DRAWER CODE
// ================================

function generateDrawerCode() {

    return String(
        generateRandomNumber(1000, 9999)
    );
}


// ================================
// SEQUENCE PUZZLE
// ================================

function generateSequencePuzzle() {

    const sequences = [

        {
            numbers: [2, 4, 8, 16],
            answer: 32
        },

        {
            numbers: [3, 6, 12, 24],
            answer: 48
        },

        {
            numbers: [4, 8, 16, 32],
            answer: 64
        },

        {
            numbers: [5, 10, 20, 40],
            answer: 80
        },

        {
            numbers: [6, 12, 24, 48],
            answer: 96
        },

        {
            numbers: [7, 14, 28, 56],
            answer: 112
        },

        {
            numbers: [8, 16, 32, 64],
            answer: 128
        },

        {
            numbers: [10, 20, 40, 80],
            answer: 160
        }

    ];


    const randomIndex =
        Math.floor(
            Math.random() *
            sequences.length
        );


    return sequences[randomIndex];
}


// Generate one random sequence
const sequencePuzzle =
    generateSequencePuzzle();


// ================================
// COMPUTER PASSWORD
// ================================

function generateComputerPassword() {

    const passwords = [

        "laboratory",
        "quantum",
        "phantom",
        "research",
        "experiment",
        "mystery",
        "scientist",
        "protocol"

    ];


    return passwords[
        Math.floor(
            Math.random() *
            passwords.length
        )
    ];
}


// ================================
// FINAL EXIT CODE
// ================================

function generateFinalCode() {

    return String(
        generateRandomNumber(1000, 9999)
    );
}


// ================================
// CREATE NEW PUZZLE SET
// ================================

const puzzleData = {

    // 🔐 Drawer
    drawerCode:
        generateDrawerCode(),


    // 🔢 Sequence
    sequenceNumbers:
        sequencePuzzle.numbers,

    sequenceAnswer:
        String(
            sequencePuzzle.answer
        ),


    // 💻 Computer
    computerPassword:
        generateComputerPassword(),


    // 🚪 Final
    finalCode:
        generateFinalCode()

};


// ================================
// DEBUG
// ================================

console.log(
    "====================================="
);

console.log(
    "🎲 NEW RANDOM PUZZLE SET"
);

console.log(
    "====================================="
);

console.log(
    "🔐 Drawer:",
    puzzleData.drawerCode
);

console.log(
    "🔢 Sequence:",
    puzzleData.sequenceNumbers.join(
        " → "
    ),
    "→ ?"
);

console.log(
    "✅ Sequence Answer:",
    puzzleData.sequenceAnswer
);

console.log(
    "💻 Computer:",
    puzzleData.computerPassword
);

console.log(
    "🚪 Final:",
    puzzleData.finalCode
);

console.log(
    "====================================="
);