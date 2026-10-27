const GameState = {
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    GAME_OVER: 2
};

let currentState = GameState.NOT_STARTED;
let inactivityTime = 0;
let stateChangeTime = performance.now();

const startupPeriod = 1000;
const nothingLabel = '<span class="nothing">Nothing</span>';
const somethingLabel = '<span class="something">Something</span>';
const timerText =document.getElementById("timerText");

function showStartText() {
    timerText.innerHTML = "Press any key to start doing " + nothingLabel + "\n";
}

function timeTextFormatted() {
    let num = Math.floor(inactivityTime);

    const days = Math.floor(num / 86400);
    num %= 86400;

    const hours = Math.floor(num / 3600);
    num %= 3600;

    const minutes = Math.floor(num / 60);
    num %= 60;

    let str = "";
    if (days > 0) {
        str += days + (days === 1 ? " day" : " days") + ", ";
    }

    if (hours > 0) {
        str += hours + (hours === 1 ? " hour" : " hours") + ", ";
    }

    if (minutes > 0) {
        str += minutes + (minutes === 1 ? " minute" : " minutes") + ", ";
    }

    str += num + (num === 1 ? " second" : " seconds");
    return str;
}

let keyPressedThisFrame = false;

window.addEventListener("keydown", function (event) {
    keyPressedThisFrame = true;
    if (event.key === "Escape") {
        window.close();
    }
});

let didSomething = false;

window.addEventListener("keydown", () => {
    didSomething = true;
}, { passive: true });

window.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        didSomething = true;
    }
}, { passive: true });

window.addEventListener("mousemove", () => {
    didSomething = true;
}, { passive: true });


window.addEventListener("touchstart", () => {
    didSomething = true;
}, { passive: true });


window.addEventListener("touchmove", () => {
    didSomething = true;
}, { passive: true });

window.addEventListener("devicemotion", (event) => {
    const a = event.accelerationIncludingGravity;
    if (!a) return;

    const x = a.x || 0;
    const y = a.y || 0;
    const z = a.z || 0;

    if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1 || Math.abs(z) > 0.1) {
        didSomething = true;
    }
}, { passive: true });

function resetGame() {
    currentState = GameState.NOT_STARTED;
    inactivityTime = 0;
    showStartText();
    stateChangeTime = performance.now();
    didSomething = false;
    keyPressedThisFrame = false;
}

showStartText();

function update(now) {
    const elapsedSinceStateChange = (now - stateChangeTime) / 1000;

    switch (currentState) {
        case GameState.NOT_STARTED:
            if (keyPressedThisFrame) {
                currentState = GameState.IN_PROGRESS;
                stateChangeTime = now;
                inactivityTime = 0;
                didSomething = false;
                break;
            }

            if (elapsedSinceStateChange >= 1) {
                showStartText();
            }
            break;

        case GameState.IN_PROGRESS:
            inactivityTime = elapsedSinceStateChange;
            timerText.innerHTML = "You have been doing " + nothingLabel + " for\n" + timeTextFormatted() + "\n";

            if (elapsedSinceStateChange >= 1 && didSomething) {
                currentState = GameState.GAME_OVER;
                stateChangeTime = now;
                break;
            }
            break;

        case GameState.GAME_OVER:
            timerText.innerHTML = "You did " + somethingLabel + ", you lost\n" + "You did " + nothingLabel + " for " + timeTextFormatted();
            if (elapsedSinceStateChange >= 1 && keyPressedThisFrame) {
                resetGame();
            }

            break;
    }

    keyPressedThisFrame = false;
    requestAnimationFrame(update);
}

requestAnimationFrame(update);