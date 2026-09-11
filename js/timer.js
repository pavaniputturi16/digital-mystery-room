/* =====================================================
   DIGITAL MYSTERY ROOM TIMER
===================================================== */

let timeLeft = 15 * 60;
let timerInterval = null;
let gameFinished = false;


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateTimer() {

    // Stop timer after game completion
    if (gameFinished) {
        return;
    }

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(seconds).padStart(2, "0");


    const timerElement =
        document.getElementById("timer");


    if (timerElement) {

        timerElement.innerText =
            `⏱️ ${formattedMinutes}:${formattedSeconds}`;

    }


    /* ================================================
       TIME OVER
    ================================================ */

    if (timeLeft <= 0) {

        clearInterval(timerInterval);

        gameFinished = true;

        localStorage.setItem(
            "timeRemaining",
            "0"
        );

        localStorage.setItem(
            "gameCompleted",
            "false"
        );

        console.log(
            "⏰ TIME OVER"
        );

        window.location.href =
            "result.html?timeout=true";

        return;
    }


    /* ================================================
       SAVE TIME
    ================================================ */

    localStorage.setItem(
        "timeRemaining",
        timeLeft
    );


    timeLeft--;
}


/* =====================================================
   STOP TIMER
===================================================== */

function stopTimer() {

    gameFinished = true;

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }

    console.log(
        "⏹️ Timer stopped"
    );
}


/* =====================================================
   START TIMER
===================================================== */

function startTimer() {

    if (timerInterval) {
        return;
    }

    updateTimer();

    timerInterval =
        setInterval(
            updateTimer,
            1000
        );

    console.log(
        "▶️ Timer started"
    );
}


/* =====================================================
   START
===================================================== */

startTimer();