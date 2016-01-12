//import MESSAGES from "./messages.js";

var gameState = {
    turns: 14,
    resultText: [""],
    scenarioText: MESSAGES.start,
    distance: 0,                    // must exceed 5 to discover cabin
    weakness: 0,                    // at 5 weakness wolf charges
    wait: 0,                        // No cap on wait at this time
    wind: false,
    wolf: false,
    advance: function(choice) {
        var turnCost = 0;           // Reduce # of 'this.turns -= 1' calls
        this.resultText = [];     // Reset array for pushes
        this.scenarioText = [];   // Reset array for pushes

        // Results
        switch (choice) {
            case "wait":
                // Inaction - the longer you wait, the more exposure you take
                // Best use: seeks shelter during wind
                // Worst use: consecutively
                // Wolf: weakness +2
                // turnCost is 1 + previous waits + 1 if wind
                this.wait += 1;
                if (this.wind) {
                    turnCost += 1;
                    this.resultText.push(MESSAGES.results.wait.wind);
                    this.wind = false;
                } else {
                    this.resultText.push(MESSAGES.results.wait.normal);
                }
                turnCost += this.wait;
                if (this.wait > 1) {
                    this.resultText.push(MESSAGES.results.wait.repeat);
                }
                if (this.wolf) {
                    this.weakness += 2;
                    this.resultText.push(MESSAGES.results.wait.wolf);
                }
                break;
            case "walk":
                // Non-wind filler, turns -1, distance +1
                // Best use: none, usually better than waiting
                // Worst use: during wind, turns -2
                // Wolf: weakness +1
                this.wait = 0;      // Breaks wait streak
                this.distance += 1;
                if (this.wind) {
                    turnCost -= 2;
                    this.resultText.push(MESSAGES.results.walk.wind);
                    this.wind = false;
                } else {
                    turnCost -= 1;
                    this.resultText.push(MESSAGES.results.walk.normal);
                }
                if (this.wolf) {
                    this.weakness += 1;
                    this.resultText.push(MESSAGES.results.walk.wolf);
                }
                break;
            case "run": // best use: distance +2, prolong life during wolf charge
                this.wait = 0;      // Breaks wait streak
                // normal: no turn loss, causes fatigue state - forced wait next turn
                // wolf: weakness +2, no turn loss, no fatigue
                //wind: exposure -1
                this.resultText = MESSAGES.results.run;
                this.turns -= 0;
                break;
            case "yell": // best use: reduces weakness
                // yell code - potential to fall-through from wait?
                // normal: exposure -wait level (does not increase wait level)
                // wolf: weakness -1
                // wind: wait exposure -1
                this.resultText = MESSAGES.results.yell.standard;
                this.turns -= 2;
                break;
            default:
                // error
                break;
        }
        this.turns -= turnCost;     // One this.turns reduction
        if (gameState.turns <= 0) {
            gameState.resultText = MESSAGES.results.end;
        }
        // Scenarios
        // 5% chance * distance for wolf to proc
        // 30% chance every turn for wind to proc
        // Cabin procs at distance > 5 && turns < 5
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
