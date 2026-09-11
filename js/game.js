const API_URL = "https://digital-mystery-room.onrender.com";

/* =====================================================
   SOUND EFFECTS
===================================================== */

const sounds = {
    click: new Audio("sounds/click.mp3"),
    clue: new Audio("sounds/clue.mp3"),
    unlock: new Audio("sounds/unlock.mp3"),
    wrong: new Audio("sounds/wrong.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    hint: new Audio("sounds/hint.mp3"),
    escape: new Audio("sounds/escape.mp3")
};


/* =====================================================
   BACKGROUND MUSIC
===================================================== */

const backgroundMusic =
    new Audio("sounds/background.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;

let soundEnabled = true;


/* =====================================================
   PLAY SOUND
===================================================== */

function playSound(name) {

    if (!soundEnabled) return;

    const sound = sounds[name];

    if (!sound) {
        console.log("Sound not found:", name);
        return;
    }

    sound.currentTime = 0;

    sound.play()
        .then(() => {
            console.log("Playing:", name);
        })
        .catch(error => {
            console.log("Sound error:", error);
        });
}


/* =====================================================
   BACKGROUND MUSIC
===================================================== */

function startBackgroundMusic() {

    if (!soundEnabled) return;

    backgroundMusic.play()
        .then(() => {
            console.log("Background music started");
        })
        .catch(error => {
            console.log(
                "Music waiting for user interaction",
                error
            );
        });
}


/* =====================================================
   STOP BACKGROUND MUSIC
===================================================== */

function stopBackgroundMusic() {

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}


/* =====================================================
   SOUND TOGGLE
===================================================== */

function toggleSound() {

    soundEnabled = !soundEnabled;

    const button =
        document.getElementById("sound-toggle");

    if (soundEnabled) {

        if (button) {
            button.innerText = "🔊 SOUND ON";
        }

        startBackgroundMusic();

    } else {

        if (button) {
            button.innerText = "🔇 SOUND OFF";
        }

        stopBackgroundMusic();
    }
}


/* =====================================================
   GAME VARIABLES
===================================================== */

let cluesFound = 0;
let hintsRemaining = 3;
let puzzlesSolved = 0;
let wrongAttempts = 0;


/* =====================================================
   PUZZLE STATUS
===================================================== */

let solvedPuzzles = {

    drawer: false,
    sequence: false,
    computer: false,
    final: false

};


/* =====================================================
   PLAYER DATA
===================================================== */

const playerName =
    localStorage.getItem("playerName") || "Guest";

const playerId =
    localStorage.getItem("playerId");


/* =====================================================
   RANDOM PUZZLE DATA
===================================================== */

console.log("🎲 Current Puzzle Data:");

if (typeof puzzleData !== "undefined") {

    console.log(
        "🔐 Drawer Code:",
        puzzleData.drawerCode
    );

    console.log(
        "🔢 Sequence Answer:",
        puzzleData.sequenceAnswer
    );

    console.log(
        "💻 Computer Password:",
        puzzleData.computerPassword
    );

    console.log(
        "🚪 Final Code:",
        puzzleData.finalCode
    );

} else {

    console.error(
        "❌ puzzleData not found. Check puzzles.js"
    );
}


/* =====================================================
   SEND RANDOM PUZZLE TO BACKEND
===================================================== */

async function sendPuzzleToBackend() {

    if (typeof puzzleData === "undefined") {

        console.error(
            "❌ Cannot send puzzle. puzzleData not found."
        );

        return;
    }

    try {

        console.log(
            "📤 Sending puzzle to backend..."
        );

        const response =
            await fetch(
                `${API_URL}/api/puzzle/set`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        drawer:
                            puzzleData.drawerCode,

                        sequence:
                            puzzleData.sequenceAnswer,

                        computer:
                            puzzleData.computerPassword,

                        final:
                            puzzleData.finalCode

                    })
                }
            );

        const data =
            await response.json();

        if (data.success) {

            console.log(
                "✅ Random puzzle sent to backend!"
            );

        } else {

            console.error(
                "❌ Backend rejected puzzle:",
                data.message
            );
        }

    } catch (error) {

        console.error(
            "❌ Could not connect to backend:",
            error
        );
    }
}


/* =====================================================
   LOAD SAVED GAME DATA
===================================================== */

function loadGameData() {

    puzzlesSolved =
        parseInt(
            localStorage.getItem("puzzlesSolved")
        ) || 0;

    wrongAttempts =
        parseInt(
            localStorage.getItem("wrongAttempts")
        ) || 0;

    const savedHints =
        localStorage.getItem("hintsRemaining");

    if (savedHints === null) {

        hintsRemaining = 3;

    } else {

        hintsRemaining =
            parseInt(savedHints);

        if (isNaN(hintsRemaining)) {
            hintsRemaining = 3;
        }
    }


    console.log("Loaded game data:");
    console.log("Puzzles:", puzzlesSolved);
    console.log("Wrong attempts:", wrongAttempts);
    console.log("Hints:", hintsRemaining);
}


/* =====================================================
   DISPLAY PLAYER + SEND PUZZLE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGameData();

        /* Send current random puzzle to Flask */

        sendPuzzleToBackend();


        const playerElement =
            document.getElementById("player-name");

        if (playerElement) {

            playerElement.innerText =
                playerName;
        }


        const hintElement =
            document.getElementById("hint-count");

        if (hintElement) {

            hintElement.innerText =
                `💡 Hints: ${hintsRemaining}`;
        }


        console.log(
            "Player:",
            playerName
        );

        console.log(
            "Player ID:",
            playerId
        );
    }
);


/* =====================================================
   MODAL
===================================================== */

function showModal(
    title,
    text,
    input = false,
    submitFunction = null
) {

    const modal =
        document.getElementById("modal");

    const modalTitle =
        document.getElementById("modal-title");

    const modalText =
        document.getElementById("modal-text");

    const inputContainer =
        document.getElementById(
            "modal-input-container"
        );

    const modalInput =
        document.getElementById(
            "modal-input"
        );

    const submitButton =
        document.getElementById(
            "modal-submit"
        );

    if (!modal) return;

    modalTitle.innerText =
        title;

    modalText.innerHTML =
        text;


    if (input) {

        inputContainer.style.display =
            "flex";

        modalInput.value =
            "";

        submitButton.onclick =
            submitFunction;

        setTimeout(() => {

            modalInput.focus();

        }, 100);

    } else {

        inputContainer.style.display =
            "none";

        submitButton.onclick =
            null;
    }


    modal.style.display =
        "flex";
}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeModal() {

    const modal =
        document.getElementById("modal");

    if (modal) {

        modal.style.display =
            "none";
    }

    /* Hide computer clue when modal closes */

    const computerClue =
        document.getElementById(
            "computer-clue"
        );

    if (computerClue) {

        computerClue.style.display =
            "none";
    }
}


/* =====================================================
   CLOCK
===================================================== */

function inspectClock() {

    startBackgroundMusic();

    playSound("click");


    showModal(

        "🕰️ Strange Clock",

        `
        <p>
            The clock has stopped at exactly
            <strong>11:45</strong>.
        </p>

        <p>
            There is a tiny message behind it:
        </p>

        <br>

        <strong>
            "Time reveals what numbers hide."
        </strong>
        `
    );


    addClue();
}


/* =====================================================
   PAINTING
===================================================== */

function inspectPainting() {

    startBackgroundMusic();

    playSound("click");


    showModal(

        "🖼️ Mysterious Painting",

        `
        <p>
            You inspect the painting carefully.
        </p>

        <p>
            Hidden behind the frame you find:
        </p>

        <h2>
            ${puzzleData.drawerCode}
        </h2>

        <p>
            This might be the code
            for the locked drawer.
        </p>
        `
    );


    addClue();
}


/* =====================================================
   BOOKS
===================================================== */

function inspectBooks() {

    startBackgroundMusic();

    playSound("click");


    let sequenceDisplay =
        "2 → 4 → 8 → 16 → ?";


    if (
        puzzleData.sequenceNumbers &&
        Array.isArray(
            puzzleData.sequenceNumbers
        )
    ) {

        sequenceDisplay =
            puzzleData.sequenceNumbers.join(
                " → "
            ) + " → ?";
    }


    showModal(

        "📚 Strange Books",

        `
        <p>
            You notice a sequence written
            inside the book:
        </p>

        <h2>
            ${sequenceDisplay}
        </h2>

        <p>
            What number comes next?
        </p>
        `,

        true,

        checkSequence
    );


    addClue();
}


/* =====================================================
   CHECK SEQUENCE USING BACKEND
===================================================== */

async function checkSequence() {

    const input =
        document.getElementById(
            "modal-input"
        );

    const answer =
        input.value.trim();


    if (!answer) {

        alert(
            "Please enter an answer."
        );

        return;
    }


    if (solvedPuzzles.sequence) {

        alert(
            "You already solved this puzzle."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/puzzle/check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        puzzle:
                            "sequence",

                        answer:
                            answer

                    })
                }
            );


        const data =
            await response.json();


        if (data.correct) {

            solvedPuzzles.sequence =
                true;

            puzzlesSolved++;


            localStorage.setItem(
                "puzzlesSolved",
                puzzlesSolved
            );


            playSound("correct");


            setTimeout(() => {

                playSound("unlock");

            }, 300);


            showModal(

                "✅ Correct!",

                `
                <p>
                    The answer is
                    <strong>
                        ${puzzleData.sequenceAnswer}
                    </strong>.
                </p>

                <p>
                    A hidden compartment opens.
                    You discover another clue.
                </p>
                `
            );

        } else {

            wrongAttempts++;

            localStorage.setItem(
                "wrongAttempts",
                wrongAttempts
            );


            playSound("wrong");


            alert(
                "❌ Wrong answer! Try again."
            );
        }


    } catch (error) {

        console.error(
            "Sequence check error:",
            error
        );

        alert(
            "❌ Backend connection error."
        );
    }
}


/* =====================================================
   DRAWER
===================================================== */

function openDrawer() {

    startBackgroundMusic();

    playSound("click");


    if (solvedPuzzles.drawer) {

        showModal(

            "🔓 Drawer Unlocked",

            `
            <p>
                You already opened the drawer.
            </p>

            <p>
                The hidden clue is:
                <strong>
                    Use the computer.
                </strong>
            </p>
            `
        );

        return;
    }


    showModal(

        "🔐 Locked Drawer",

        `
        <p>
            The drawer requires a
            4-digit code.
        </p>

        <p>
            Look carefully at the painting.
        </p>
        `,

        true,

        checkDrawerCode
    );


    addClue();
}


/* =====================================================
   CHECK DRAWER USING BACKEND
===================================================== */

async function checkDrawerCode() {

    const input =
        document.getElementById(
            "modal-input"
        );

    const answer =
        input.value.trim();


    if (!answer) {

        alert(
            "Enter the 4-digit code."
        );

        return;
    }


    if (solvedPuzzles.drawer) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/puzzle/check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        puzzle:
                            "drawer",

                        answer:
                            answer

                    })
                }
            );


        const data =
            await response.json();


        if (data.correct) {

            solvedPuzzles.drawer =
                true;

            puzzlesSolved++;


            localStorage.setItem(
                "puzzlesSolved",
                puzzlesSolved
            );


            playSound("correct");


            setTimeout(() => {

                playSound("unlock");

            }, 300);


            showModal(

                "🔓 Drawer Opened!",

                `
                <p>
                    The code
                    <strong>
                        ${answer}
                    </strong>
                    works!
                </p>

                <p>
                    Inside the drawer
                    you find a note:
                </p>

                <h3>
                    "The computer knows the truth."
                </h3>
                `
            );

        } else {

            wrongAttempts++;

            localStorage.setItem(
                "wrongAttempts",
                wrongAttempts
            );


            playSound("wrong");


            alert(
                "❌ Incorrect code!"
            );
        }


    } catch (error) {

        console.error(
            "Drawer check error:",
            error
        );

        alert(
            "❌ Backend connection error."
        );
    }
}


/* =====================================================
   COMPUTER
===================================================== */

function openComputer() {

    startBackgroundMusic();

    playSound("click");


    // Already solved
    if (solvedPuzzles.computer) {

        showModal(
            "💻 Computer",
            `
            <p>The computer is already unlocked.</p>
            `,
            false
        );

        return;
    }


    // Show password screen
    showModal(
        "💻 Laboratory Computer",

        `
        <p>
            The computer asks for a password.
        </p>

        <p>
            Enter the password to access
            the laboratory system.
        </p>
        `,

        true,

        checkComputerPassword
    );


    // Dynamic clue
    setTimeout(() => {

        const computerClue =
            document.getElementById("computer-clue");


        if (!computerClue) {
            return;
        }


        let clueText =
            "The password is hidden somewhere in the laboratory.";


        // Check random password
        switch (
            puzzleData.computerPassword.toLowerCase()
        ) {


            case "laboratory":

                clueText =
                    "Think about the place where experiments and research happen.";

                break;


            case "quantum":

                clueText =
                    "Think about the mysterious world of particles and physics.";

                break;


            case "phantom":

                clueText =
                    "Think of a mysterious spirit-like figure.";

                break;


            case "research":

                clueText =
                    "Think about the process of discovering new knowledge.";

                break;


            case "experiment":

                clueText =
                    "Think about a scientific test performed to discover something.";

                break;


            case "mystery":

                clueText =
                    "Think about something unknown that needs to be solved.";

                break;


            case "scientist":

                clueText =
                    "Think about the person who performs experiments and discovers new things.";

                break;


            case "protocol":

                clueText =
                    "Think about a set of rules or procedures followed in a laboratory.";

                break;

        }


        // Display dynamic clue
        computerClue.innerHTML = `
            🔎 <strong>Small Clue:</strong>
            <span>
                ${clueText}
            </span>
        `;


        computerClue.style.display =
            "block";


    }, 100);


    addClue();

}


/* =====================================================
   CHECK COMPUTER USING BACKEND
===================================================== */

async function checkComputerPassword() {

    const input =
        document.getElementById(
            "modal-input"
        );

    const answer =
        input.value.trim();


    if (!answer) {

        alert(
            "Enter the password."
        );

        return;
    }


    if (solvedPuzzles.computer) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/puzzle/check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        puzzle:
                            "computer",

                        answer:
                            answer

                    })
                }
            );


        const data =
            await response.json();


        if (data.correct) {

            solvedPuzzles.computer =
                true;

            puzzlesSolved++;


            localStorage.setItem(
                "puzzlesSolved",
                puzzlesSolved
            );


            playSound("correct");


            setTimeout(() => {

                playSound("unlock");

            }, 300);


            showModal(

                "💻 Computer Unlocked!",

                `
                <p>
                    Password accepted!
                </p>

                <p>
                    The computer displays:
                </p>

                <h2>
                    FINAL EXIT CODE:
                    ${puzzleData.finalCode}
                </h2>

                <p>
                    Enter this code at
                    the exit door.
                </p>
                `
            );

        } else {

            wrongAttempts++;

            localStorage.setItem(
                "wrongAttempts",
                wrongAttempts
            );


            playSound("wrong");


            alert(
                "❌ Wrong password!"
            );
        }


    } catch (error) {

        console.error(
            "Computer check error:",
            error
        );

        alert(
            "❌ Backend connection error."
        );
    }
}


/* =====================================================
   EXIT DOOR
===================================================== */

function tryExit() {

    startBackgroundMusic();

    playSound("click");


    if (puzzlesSolved < 3) {

        showModal(

            "🚪 Locked Exit",

            `
            <p>
                The exit door is still locked.
            </p>

            <p>
                You need to solve all
                <strong>3 puzzles</strong>.
            </p>

            <p>
                Progress:
                <strong>
                    ${puzzlesSolved}/3
                </strong>
            </p>
            `
        );

        return;
    }


    showModal(

        "🚪 Final Lock",

        `
        <p>
            Enter the final
            4-digit escape code.
        </p>
        `,

        true,

        checkFinalCode
    );
}


/* =====================================================
   CHECK FINAL CODE USING BACKEND
===================================================== */

async function checkFinalCode() {

    const input =
        document.getElementById(
            "modal-input"
        );

    const answer =
        input.value.trim();


    if (!answer) {

        alert(
            "Enter the final code."
        );

        return;
    }


    if (solvedPuzzles.final) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/puzzle/check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        puzzle:
                            "final",

                        answer:
                            answer

                    })
                }
            );


        const data =
            await response.json();


        /* =============================================
           WRONG FINAL CODE
        ============================================= */

        if (!data.correct) {

            wrongAttempts++;


            localStorage.setItem(
                "wrongAttempts",
                wrongAttempts
            );


            playSound("wrong");


            alert(
                "❌ Wrong final code!"
            );

            return;
        }


        /* =============================================
           FINAL CODE CORRECT
        ============================================= */

        console.log(
            "🎉 FINAL CODE CORRECT!"
        );


        solvedPuzzles.final =
            true;

        puzzlesSolved =
            3;


        localStorage.setItem(
            "puzzlesSolved",
            "3"
        );


        localStorage.setItem(
            "wrongAttempts",
            wrongAttempts
        );


        localStorage.setItem(
            "gameCompleted",
            "true"
        );


        /* =============================================
           SAVE TIME
        ============================================= */

        const currentTime =
            localStorage.getItem(
                "timeRemaining"
            );


        if (currentTime) {

            localStorage.setItem(
                "finalTimeRemaining",
                currentTime
            );
        }


        /* =============================================
           ESCAPE SOUND
        ============================================= */

        playSound("escape");


        /* =============================================
           SUCCESS MODAL
        ============================================= */

        showModal(

            "🎉 YOU ESCAPED!",

            `
            <div style="text-align:center;">

                <h2>
                    🔓 LABORATORY UNLOCKED
                </h2>

                <p>
                    Congratulations Detective!
                </p>

                <p>
                    You solved all the puzzles
                    and escaped the laboratory.
                </p>

                <p>
                    🚪
                    <strong>
                        ESCAPE SUCCESSFUL!
                    </strong>
                </p>

                <br>

                <p>
                    ⏳ Opening result page...
                </p>

            </div>
            `,

            false
        );


        /* =============================================
           SAVE RESULT
        ============================================= */

        await saveGameResult(true);


        console.log(
            "✅ Game result saved"
        );


        stopTimer();


        /* =============================================
           REDIRECT
        ============================================= */

        window.location.replace(
            "result.html?completed=true&t=" +
            Date.now()
        );

    } catch (error) {

        console.error(
            "Final check error:",
            error
        );

        alert(
            "❌ Backend connection error."
        );
    }
}


/* =====================================================
   ADD CLUE
===================================================== */

function addClue() {

    if (cluesFound < 3) {

        cluesFound++;

        playSound("clue");


        const clueElement =
            document.getElementById(
                "clue-count"
            );


        if (clueElement) {

            clueElement.innerText =
                `🔎 Clues: ${cluesFound}/3`;
        }
    }
}


/* =====================================================
   HINT SYSTEM
===================================================== */

function useHint() {

    startBackgroundMusic();


    if (hintsRemaining <= 0) {

        alert(
            "❌ No hints remaining!"
        );

        return;
    }


    hintsRemaining--;


    localStorage.setItem(
        "hintsRemaining",
        hintsRemaining
    );


    playSound("hint");


    const hintElement =
        document.getElementById(
            "hint-count"
        );


    if (hintElement) {

        hintElement.innerText =
            `💡 Hints: ${hintsRemaining}`;
    }


    let hintMessage = "";


    /* =================================================
       DYNAMIC HINTS
    ================================================= */

    if (hintsRemaining === 2) {

        hintMessage =
            `
            🖼️ Check the mysterious painting.
            It contains the drawer code:
            <strong>
                ${puzzleData.drawerCode}
            </strong>
            `;

    }

    else if (hintsRemaining === 1) {

        hintMessage =
            `
            📚 The book sequence doubles each time.
            The answer is:
            <strong>
                ${puzzleData.sequenceAnswer}
            </strong>
            `;

    }

    else {

        hintMessage =
            `
            💻 The computer password is:
            <strong>
                ${puzzleData.computerPassword}
            </strong>
            `;
    }


    showModal(

        "💡 Detective Hint",

        `<p>${hintMessage}</p>`
    );
}


/* =====================================================
   SAVE GAME RESULT
===================================================== */

async function saveGameResult(
    completed
) {

    const storedPlayerId =
        localStorage.getItem(
            "playerId"
        );


    if (!storedPlayerId) {

        console.log(
            "No player ID found."
        );

        return;
    }


    const timeRemaining =
        parseInt(
            localStorage.getItem(
                "timeRemaining"
            )
        ) || 0;


    try {

        const response =
            await fetch(
                `${API_URL}/api/game/save`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        player_id:
                            parseInt(
                                storedPlayerId
                            ),

                        time_remaining:
                            timeRemaining,

                        hints_used:
                            3 - hintsRemaining,

                        wrong_attempts:
                            wrongAttempts,

                        puzzles_solved:
                            puzzlesSolved,

                        completed:
                            completed

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Game saved:",
            data
        );


        if (data.success) {

            localStorage.setItem(
                "score",
                data.score
            );


            console.log(
                "🏆 Score saved:",
                data.score
            );
        }


    } catch (error) {

        console.error(
            "Save Game Error:",
            error
        );
    }
}


/* =====================================================
   BACKEND TEST
===================================================== */

async function testBackend() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/player/1`
            );


        const data =
            await response.json();


        console.log(
            "Backend Test:",
            data
        );


    } catch (error) {

        console.error(
            "Backend Test Failed:",
            error
        );
    }
}


/* =====================================================
   CREATE PLAYER
===================================================== */

async function createPlayer(name) {

    try {

        console.log("📤 Creating player:", name);
        console.log("🌐 API URL:", API_URL);

        const response = await fetch(
            `${API_URL}/api/player`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name
                })
            }
        );

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const data = await response.json();

        console.log("📥 Backend response:", data);

        if (data.success) {

            localStorage.setItem(
                "playerId",
                data.player_id
            );

            localStorage.setItem(
                "playerName",
                data.name
            );

            console.log(
                "✅ Player created:",
                data
            );

            return data;
        }

        console.error(
            "❌ Backend response did not contain success=true:",
            data
        );

    } catch (error) {

        console.error(
            "❌ Create Player Error:",
            error
        );

        alert(
            "Backend connection failed.\n\n" +
            error.message
        );
    }

    return null;
}