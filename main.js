//import MESSAGES from "./messages.js";

var gameState = {
    turns: 14,
    resultText: [""],
    scenarioText: MESSAGES.start,
    distance: 0,                    // must exceed 5 to discover cabin
    weakness: 0,                    // at 5 weakness wolf charges
    adrenaline: false,              // run w/o fatigue
    fatigue: false,                 // forced wait next turn
    wait: 0,                        // No cap on wait at this time
    wind: false,
    wolf: false,
    cabin: false,
    win: 0,                         // must equal 3 to win
    advance: function(choice) {
        var turnCost = 0;           // Reduce # of 'this.turns -= 1' calls
        this.resultText = [];       // Reset array for pushes
        this.scenarioText = [];     // Reset array for pushes

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
                    this.weakness += 1;
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
                    turnCost += 2;
                    this.resultText.push(MESSAGES.results.walk.wind);
                    this.wind = false;
                } else {
                    turnCost += 1;
                    this.resultText.push(MESSAGES.results.walk.normal);
                }
                if (this.wolf) {
                    this.weakness += 0.5;
                    this.resultText.push(MESSAGES.results.walk.wolf);
                }
                break;
            case "run":
                // Big distance move, no turnCost, distance +2, causes fatigue*
                // Best use: during wolf charge to prolong life
                // Worst use: during wind, turns -1, with wolf phase1: weakness +3
                this.wait = 0;      // Breaks wait streak
                this.distance += 2;
                this.fatigue = true;
                this.resultText.push(MESSAGES.results.run.normal);
                if (this.wind) {
                    turnCost += 1;
                    this.resultText.push(MESSAGES.results.run.wind);
                }
                if (this.wolf) {
                    if (this.adrenaline) {
                        this.fatigue = false;
                        this.resultText.push(MESSAGES.results.run.wolfCharge);
                    } else {
                        this.weakness += 1.5;
                        this.resultText.push(MESSAGES.results.run.wolf);
                    }
                }
                break;
            case "yell": // best use: reduces weakness
                // Similar to wait, has effect on wolf phase 1
                // Best use: during phase 1 wolf, weakness -1
                // Worst use: during wind, turnCost +1, no weakness reduction
                // Does not reset or increase wait streak
                if (this.wind) {
                    turnCost += 2;
                    if (this.wolf) {
                        this.resultText.push(MESSAGES.results.yell.wolfWind);
                    } else {
                        this.resultText.push(MESSAGES.results.yell.wind);
                    }
                } else {
                    turnCost += 1;
                    if (this.wolf) {
                        this.weakness -= 1;
                        this.resultText.push(MESSAGES.results.yell.wolf);
                    } else {
                        this.resultText.push(MESSAGES.results.yell.normal);
                    }
                }
                break;
            default:
                // error
                break;
        }
        this.turns -= turnCost;     // One this.turns reduction
        if (this.wind) { this.wind = false; } // turn wind off

        // Endings
        if (this.turns < 1) {
            this.resultText = MESSAGES.results.end.dead;
            status();
            return;
        } else if (this.win > 2) {
            this.resultText = MESSAGES.results.end.win;
            return;
        } else if (this.weakness > 10) {
            this.resultText = MESSAGES.results.end.wolf;
            return;
        }

        // Scenarios
        var roll = Math.floor(Math.random() * 10); // 0-9

        // 5% chance * distance for wolf to proc
        if (!this.wolf) {
            this.wolf = roll < (this.distance * 0.5) ? true : false;
        }
        if (this.wolf) {
            this.adrenaline = true;
            this.scenarioText.push(MESSAGES.scenarios.wolf[Math.floor(this.weakness)]);
        }

        // 30% chance every turn for wind to proc
        if (roll < 3) {
            this.wind = true;       // Turn wind on
            this.scenarioText.push(MESSAGES.scenarios.wind);
        } else {
            this.scenarioText.push(MESSAGES.scenarios.normal);
        }

        // Cabin procs at distance > 5 && turns < 5
        if (!this.cabin) {
            if (this.distance > 4 && this.turns < 5) {
                this.cabin = true;
                this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
            }
        } else {
            this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
            switch (choice) {
                case "walk":
                    this.win += 1;
                    break;
                case "run":
                    this.win += 2;
                    break;
                default:
                    // error
                    break;
            }
        }
        status();
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

// Testing
function status() {
    console.log(
        "Turns: " + gameState.turns + "\n" +
        "Distance: " + gameState.distance + "\n" +
        "Weakness: " + gameState.weakness + "\n" +
        "Wait: " + gameState.wait + "\n" +
        "Wolf: " + gameState.wolf
    );
}
