var gameState = {
    turns: 14,
    resultText: [""],
    scenarioText: MESSAGES.start,
    snow: [],
    distance: 0,                    // must exceed 5 to discover cabin
    weakness: 0,                    // at 5 weakness wolf charges
    adrenaline: false,              // run w/o fatigue
    fatigue: false,                 // forced wait next turn
    wait: 0,                        // No cap on wait at this time
    wind: false,
    wolf: false,
    cabin: false,
    win: 0,                         // must equal 3 to win
    gameOver: false,

    loader: function(arr) {
        "use strict";
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

    endings: function() {
        // not complete or implemented yet
        var buttons = document.getElementsByTagName("input");
        Array.prototype.forEach.call(buttons, function(butt) {
            butt.display = none;
        });
        var reset = document.getElementById("reset");
        reset.display = inline;
        
        if (this.win > 2) {
            // Cabin win
        } else if (this.weakness > 7) {
            // Wolf lose
        } else {
            // Exposure lose
        }
    },

	fatigueSwitch: function() {
		"use strict";
		// experimental solution to clean up code
		// first switch fatigue depending on current state
		this.fatigue = (this.fatigue ? false : true);

		// then disable/enable buttons based on this call
        var buttons = document.getElementsByClassName("fatigue");
		Array.prototype.forEach.call(buttons, function(butt) {
			butt.disabled = (gameState.fatigue ? true : false);
		});
	},

    advance: function(choice) {
        "use strict";
        var turnCost = 0;           // Reduce # of 'this.turns -= 1' calls
        var buttons;
        this.resultText = [];       // Reset array for pushes
        this.scenarioText = [];     // Reset array for pushes
		if (this.fatigue) { this.fatigueSwitch(); }

        /* Reset fatigue
        if (this.fatigue) {
            buttons = document.getElementsByClassName("fatigue");
            Array.prototype.forEach.call(buttons, function(butt) {
                butt.disabled = false;
            });
            this.fatigue = false;
        }*/

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
                    if (this.turns % 2 === 0) {
                        this.resultText.push(MESSAGES.results.walk.normal);
                    } else {
                        this.resultText.push(MESSAGES.results.walk.alternate);
                    }
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
                // this.fatigue = true;
				if (!this.adrenaline) { this.fatigueSwitch(); }
                this.resultText.push(MESSAGES.results.run.normal);
                if (this.wind) {
                    turnCost += 1;
                    this.resultText.push(MESSAGES.results.run.wind);
                }
                if (this.wolf) {
                    this.weakness += 1.5;
                    if (this.adrenaline) {
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

        // Endings
        if (this.win > 2) {
            this.resultText = MESSAGES.results.end.win;
            return;
        } else if (this.weakness > 7) {
            this.resultText = MESSAGES.results.end.wolf;
            return;
        } else if (this.turns < 1) {
            this.resultText = MESSAGES.results.end.dead;
            return;
        }
        /* Enable fatigue effects
        if (this.fatigue) {
            buttons = document.getElementsByClassName("fatigue");
            Array.prototype.forEach.call(buttons, function(butt) {
                butt.disabled = true;
            });
        }*/
        // Reset wind
        if (this.wind) { this.wind = false; } // turn wind off

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

// Testing
function status() {
    "use strict";
    console.log(
        "Turns: " + gameState.turns + "\n" +
        "Distance: " + gameState.distance + "\n" +
        "Weakness: " + gameState.weakness + "\n" +
		"Fatigue: " + gameState.fatigue + "\n" +
		"Adrenaline: " + gameState.adrenaline + "\n" +
        "Wait: " + gameState.wait + "\n" +
        "Wolf: " + gameState.wolf + "\n" +
        "Win: " + gameState.win
    );
}
