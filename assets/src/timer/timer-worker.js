

let whiteTime = { min: 0, secs: 2, running: false, milSecs: 0, shouldSetMil: true, milTimerRunning: false };
let blackTime = { min: 0, secs: 17, running: false, milSecs: 0, shouldSetMil: true, milTimerRunning: false };
let isGameOver = false;
let gameTerminationReason = "";
let secondsIncrement = 0;


let timerIntervals = null;
let miliTimerIntervalId = null


function startTimer(colour) {
    clearInterval(timerIntervals)
    
  timerIntervals = setInterval(() => {
    if  (colour === 'black') {
        if (isGameOver) {
            clearInterval(timerIntervals)
            return
        }
        if (blackTime.secs) {
            blackTime.secs -= 1;
            if (!blackTime.secs && !blackTime.min) {
                isGameOver = true
                gameTerminationReason = "Black lost on time."
                postMessage("Game over. Black lost on time.")
                clearInterval(timerIntervals)
            }
          } else {
            if (blackTime.min) {
              blackTime.min -= 1;
              blackTime.secs = 59;
            } else {
                    isGameOver = true
                    gameTerminationReason = "Black lost on time."
                    postMessage("Game over. Black lost on time.")
                    clearInterval(timerIntervals)
            }
          }
    } else if (colour === "white" ) {
        if (isGameOver) {
            clearInterval(timerIntervals)
            return
        }
        if (whiteTime.secs) {
            whiteTime.secs -= 1;
            if (!whiteTime.secs && !whiteTime.min) {
                isGameOver = true
                gameTerminationReason = "White lost on time."
                postMessage("Game over. White lost on time.")
                clearInterval(timerIntervals)
            }
          } else {
            if (whiteTime.min) {
              whiteTime.min -= 1;
              whiteTime.secs = 59;
            } else {
                    isGameOver = true
                    gameTerminationReason = "White lost on time."
                    postMessage("Game over. White lost on time.")
                    clearInterval(timerIntervals)
            }
          }

    }

    // Send the updated time remaining back to the main thread
    self.postMessage({ whiteTime, blackTime, gameTerminationReason, isGameOver });
  }, 1000)
}

// Listen for messages from the main thread
self.onmessage = function (event) {
    // console.log("message from main thread:", event.data)
    if (event.data === "kill") {
		// console.log(event.data)
        clearInterval(timerIntervals)
    }
    else if (event.data.initial) {
        // console.log("we have an initial message")
        const w = event.data.whiteTime
        whiteTime.min = w.min
        whiteTime.secs = w.secs
        whiteTime.milSecs = w.milSecs

        const b = event.data.blackTime
        blackTime.min = b.min
        blackTime.secs = b.secs
        blackTime.milSecs = b.milSecs

        secondsIncrement = event.data.increment
    }
    if (!isGameOver) {
        if (event.data.startWhiteTimer) {
            // Add increment to black time
            blackTime.min += Math.floor((blackTime.secs + secondsIncrement) / 60)
            blackTime.secs = (blackTime.secs + secondsIncrement) % 60
            startTimer("white")
        }
        else if (event.data.startBlackTimer) {
             // Add increment to white time
            whiteTime.min += Math.floor((whiteTime.secs + secondsIncrement) / 60)
            whiteTime.secs = (whiteTime.secs + secondsIncrement) % 60

            startTimer("black")
        }
    }
};
