function Game() {
    "use strict";
    this.turns = 14;
    this.state = "main";
    this.resultText = [];
    this.scenarioText = MESSAGES.start;
    this.waits = 0;
    this.distance = 0;
    this.weakness = 0;
    this.win = 0;
    this.adrenaline = false;
    this.fatigue = false;
    this.wind = false;
    this.wolf = false;
    this.cabin = false;
}

Game.prototype.fatigueSwitch = function() {
    this.fatigue = (this.fatigue ? false : true);
    var that = this.fatigue;
    var buttons = document.getElementsByClassName("fatigue");
    Array.prototype.forEach.call(buttons, function(butt) {
        butt.disabled = (that ? true : false);
    });
}

Game.prototype.disableAll = function() {
    var buttons = document.getElementsByTagName("input");
    Array.prototype.forEach.call(buttons, function(butt) {
        if (butt.className != "special") { butt.disabled = true; }
    });
}

Game.prototype.wait = function() {
    var text = [];
    if (this.fatigue) { this.fatigueSwitch(); }
    this.waits += 1;
    if (this.wind) {
        this.turns -= 1;
        text.push(MESSAGES.results.wait.wind);
    } else {
        text.push(MESSAGES.results.wait.normal);
    }
    this.turns -= this.waits;
    if (this.waits > 1) { text.push(MESSAGES.results.wait.repeat); }
    if (this.wolf) {
        this.weakness += 1;
        text.push(MESSAGES.results.wait.wolf);
    }
    this.advance(text);
}

Game.prototype.walk = function() {
    var text = [];
    this.waits = 0;
    this.distance += 1;
    this.turns -= 1;
    if (this.wind) {
        this.turns -= 1;
        text.push(MESSAGES.results.walk.wind);
        this.wind = false;
    } else {
        if (this.turns % 2 === 0) {
            text.push(MESSAGES.results.walk.normal);
        } else {
            text.push(MESSAGES.results.walk.alternate);
        }
    }
    if (this.wolf) {
        this.weakness += 0.5;
        text.push(MESSAGES.results.walk.wolf);
    }
    if (this.cabin) { this.win += 1; }
    this.advance(text);
}

Game.prototype.run = function() {
    var text = [];
    this.waits = 0;
    this.distance += 2;
    if (!this.adrenaline) { this.fatigueSwitch(); }
    text.push(MESSAGES.results.run.normal);
    if (this.wind) {
        this.turns -= 1;
        text.push(MESSAGES.results.run.wind);
    }
    if (this.wolf) {
        this.weakness += 1.5;
        if (this.adrenaline) {
            text.push(MESSAGES.results.run.wolfCharge);
        } else {
            text.push(MESSAGES.results.run.wolf);
        }
    }
    if (this.cabin) { this.win += 2; }
    this.advance(text);
}

Game.prototype.yell = function() {
    var text = [];
    this.turns -= 1;
    if (this.wind) {
        this.turns -= 1;
        if (this.wolf) {
            text.push(MESSAGES.results.yell.wolfWind);
        } else {
            text.push(MESSAGES.results.yell.wind);
        }
    } else {
        if (this.wolf) {
            if (this.weakness > 0) { this.weakness -= 1; }
            text.push(MESSAGES.results.yell.wolf);
        } else {
            text.push(MESSAGES.results.yell.normal);
        }
    }
    this.advance(text);
}

Game.prototype.advance = function(text) {
    function roll(max) {
        return Math.floor(Math.random() * max);
    }
    this.resultText = text;
    this.scenarioText = [];
    if (this.wind) { this.wind = false; }

    // Check for ending conditions
    if (this.win > 2) {
        this.resultText = MESSAGES.results.end.win;
        this.state = "cabin";
        this.disableAll();
        return;
    } else if (this.weakness > 7) {
        this.resultText = MESSAGES.results.end.wolf;
        this.state = "wolf";
        this.disableAll();
        return;
    } else if (this.turns < 1) {
        this.resultText = MESSAGES.results.end.dead;
        this.state = "exposure";
        this.disableAll();
        return;
    }

    // Scenarios
    if (!this.wolf) {
        this.wolf = (roll(10) < (this.distance * 0.5)) ? true : false;
    }
    if (this.wolf) {
        if (this.weakness > 3) {
            this.adrenaline = true;
        }
        this.scenarioText.push(MESSAGES.scenarios.wolf[Math.ceil(this.weakness)]);
    }

    if (roll(10) < 3) {
        this.wind = true;
        this.scenarioText.push(MESSAGES.scenarios.wind);
    } else {
        this.scenarioText.push(MESSAGES.scenarios.normal);
    }

    if (!this.cabin) {
        if ((this.distance > 4 && this.turns < 6) || this.distance > 9) {
            this.cabin = true;
            this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
        }
    } else {
        this.scenarioText.push(MESSAGES.scenarios.cabin[this.win]);
    }
    this.resultText = flatten(this.resultText);
    this.scenarioText = flatten(this.scenarioText);
}
