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

    loader: function(arr) {
        var newArr = [];

        function flatten(arr) {
            arr.forEach(function(entry) {
                if (typeof entry === "string") {
                    newArr.push(entry);
                } else {
                    return flatten(entry);
                }
            });
        }
        flatten(arr);

        return newArr;
    },

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
                if (this.cabin) { this.win += 1; }
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
                    this.weakness += 1.5;
                    if (this.adrenaline) {
                        this.fatigue = false;
                        this.resultText.push(MESSAGES.results.run.wolfCharge);
                    } else {
                        this.resultText.push(MESSAGES.results.run.wolf);
                    }
                }
                if (this.cabin) { this.win += 2; }
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
        if (this.win > 2) {
            this.resultText = MESSAGES.results.end.win;
            return;
        } else if (this.weakness > 7) {
            this.resultText = MESSAGES.results.end.wolf;
            return;
        } else if (this.turns < 1) {
            this.resultText = MESSAGES.results.end.dead;
            status();
            return;
        }

        // Scenarios
        var roll = Math.floor(Math.random() * 10); // 0-9

        // 5% chance * distance for wolf to proc
        if (!this.wolf) {
            this.wolf = roll < (this.distance * 0.5) ? true : false;
        }
        if (this.wolf) {
            if (this.weakness > 3) {
                this.adrenaline = true;
            }
            this.scenarioText.push(MESSAGES.scenarios.wolf[Math.ceil(this.weakness)]);
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
            if ((this.distance > 4 && this.turns < 5) || this.distance > 10) {
                this.cabin = true;
                this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
            }
        } else {
            this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
        }
        this.resultText = this.loader(this.resultText);
        this.scenarioText = this.loader(this.scenarioText);
        status();
    }
}

function Flake(x) {
    this.sprite = new Image();
    this.sprite.src = "./snow_flake.png";
    this.x = x;
    this.y = -25;
}
var snow = []; // global variable - find a better solution

function init() {
    for (var i = 0; i < 50; i++) {
        snow[i] = new Flake(Math.floor(Math.random() * 775)); // canvas.width - 25
    }
    window.requestAnimationFrame(draw);
}

function draw(timeStamp) {
    window.requestAnimationFrame(draw);

    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    var timedRelease = timeStamp/1000;
    var fontSize = 24;
    ctx.font = fontSize + "px sans-serif";

    // Initial colours
    var lingrad = ctx.createLinearGradient(0, 0, 0, 450);
    lingrad.addColorStop(0, "#1D4183");
    lingrad.addColorStop(1, "#000000");

    ctx.clearRect(0, 0, 800, 450);
    // Initial colours
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, 800, 450);
    ctx.fillStyle = "#FFF";

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

    // Snowfall
    snow.forEach(function(flake, index) {
        if (index < timedRelease) {
            flake.y += 1;
            if (flake.y > 450) {
                flake.y = -25;
            }
            ctx.drawImage(flake.sprite, flake.x, flake.y);
        }
    });
}

// Testing
function status() {
    console.log(
        "Turns: " + gameState.turns + "\n" +
        "Distance: " + gameState.distance + "\n" +
        "Weakness: " + gameState.weakness + "\n" +
        "Wait: " + gameState.wait + "\n" +
        "Wolf: " + gameState.wolf + "\n" +
        "Win: " + gameState.win
    );
}
