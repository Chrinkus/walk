function Flake(x) {
    "use strict";
    this.sprite = new Image();
    this.sprite.src = "./snow_flake.png";
    this.x = x;
    this.y = -25;
}

function init() {
    "use strict";
    for (var i = 0; i < 50; i++) {
        gameState.snow[i] = new Flake(Math.floor(Math.random() * 775)); // canvas.width - 25
    }
    window.requestAnimationFrame(draw);
}

function draw(timeStamp) {
    "use strict";
    window.requestAnimationFrame(draw);

    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    var timedRelease = timeStamp/1000;
    var fontSize = 24;
    ctx.font = fontSize + "px sans-serif";

    // Initial colours
    var lingrad = ctx.createLinearGradient(0, 0, 0, 450);
    lingrad.addColorStop(0, "#0A56A0");
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
    gameState.snow.forEach(function(flake, index) {
        if (index < timedRelease) {
            flake.y += 1;
            if (flake.y > 450) {
                flake.y = -25;
            }
            ctx.drawImage(flake.sprite, flake.x, flake.y);
        }
    });
}
