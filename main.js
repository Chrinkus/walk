//import MESSAGES from "./messages.js";

var gameState = {
    turns: 14,
    resultText: [""],
    scenarioText: MESSAGES.start,
    distance: 0, // must exceed 5 to discover cabin
    weakness: 0,
    wait: 0,
    wind: false,
    wolf: false, // at 5 weakness wolf charges catching player in one wait, 2 walks, or 3 runs
    advance: function(choice) {
        switch (choice) {
            case "wait": // best use: seeks shelter during wind
                // normal: exposure reduces turns by increasing values for consecutive non-waits
                // wolf: weakness +1
                // wind: turns -1
                this.resultText = MESSAGES.results.wait.standard;
                this.turns -= 3;
                break;
            case "walk": // best use: non-wind filler, distance + 1
                // normal: turns -1
                // wolf: weakness +1
                // wind: turns -2
                this.resultText = MESSAGES.results.walk;
                this.turns -= 1;
                break;
            case "run": // best use: distance +2, prolong life during wolf charge
                // normal: no turn loss, causes fatigue state - forced wait next turn
                // wolf: weakness +2, no turn loss, no fatigue
                //wind: exposure -1
                this.resultText = MESSAGES.results.run;
                this.turns -= 0;
                break;
            case "yell": // best use: reduces weakness
                // yell code - potential to fall-through from wait?
                // normal: exposure -wait level (max 2, does not increase wait level)
                // wolf: weakness -1
                // wind: wait exposure -1
                this.resultText = MESSAGES.results.yell.standard;
                this.turns -= 2;
                break;
            default:
                // error
                break;
        }
        if (gameState.turns <= 0) {
            gameState.resultText = MESSAGES.results.end;
        }
    }
}

function draw(choice) {
    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    var fontSize = 24;
    ctx.font = fontSize + "px sans-serif";

    if (choice) {
        gameState.advance(choice);
    }
    ctx.clearRect(0, 0, 800, 450);

    // Upper-text - resultText
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    gameState.resultText.forEach(function(line, i) {
        ctx.fillText(line, 25, (75 + fontSize * 1.5 * i));
    });

    // Lower-text - scenarioText
    ctx.textAlign = "right";
    ctx.textBaseline = "hanging";
    gameState.scenarioText.forEach(function(line, i) {
        ctx.fillText(line, (canvas.width - 25), (canvas.height / 2 + fontSize * 1.5 * i));
    });
}

function wait() {
    return draw("wait");
}
function walk() {
    return draw("walk");
}
function run() {
    return draw("run");
}
function yell() {
    return draw("yell");
}
