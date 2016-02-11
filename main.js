(function() {
    "use strict";
    // Init
    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    var gameState = new Game();
    var msCount = 0;
    var hRSeconds = 0;
    var diff = 0;
    var ref = 0;
    var counter = 0;
    var cancelSnow = false;

    // Global settings
    var fontSize = 24;
    var fontColor = "#FFF";
    ctx.font = fontSize + "px sans-serif";

    // Snow
    var snow = fillSnow(60);

    // Buttons
    createButton(function() { gameState.wait(); }, "Wait");
    createButton(function() { gameState.walk(); }, "Walk", "fatigue");
    createButton(function() { gameState.run(); }, "Run", "fatigue");
    createButton(function() { gameState.yell(); }, "Yell", "fatigue");

    function main(hRTime) {
        window.requestAnimationFrame(main);
        var snowLength = snow.length;
        hRSeconds = Math.floor(hRTime / 1000);
        if (counter < snowLength - 1) {
            diff = hRSeconds - ref;
            if (diff <= 1) { counter += diff; }
            ref = hRSeconds;
        }
        var timeStamp = new Date();
        msCount = timeStamp.getMilliseconds() % 1000;

        ctx.clearRect(0, 0, 800, 450);

        switch (gameState.state) {
            case "main":
                var lingrad = ctx.createLinearGradient(0, 0, 0, 450);
                var dynamicStop = gameState.turns / 14;
                lingrad.addColorStop(0, "#05A");
                lingrad.addColorStop((gameState.turns >= 0 ? dynamicStop : 0), "#000");
                ctx.fillStyle = lingrad;
                ctx.fillRect(0, 0, 800, 450);
                break;
            case "exposure":
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, 800, 450);
                break;
            case "wolf":
                ctx.fillStyle = "#900";
                ctx.fillRect(0, 0, 800, 450);
                break;
            case "cabin":
                var flicker = ((msCount / 1000 * 60) + 60);
                var cabinLingrad = ctx.createLinearGradient(0, flicker, 0, 450);
                cabinLingrad.addColorStop(0.4, "#963");
                cabinLingrad.addColorStop(0.8, "#FF0");
                cabinLingrad.addColorStop(1, "#F00");
                ctx.fillStyle = cabinLingrad;
                ctx.fillRect(0, 0, 800, 450);
                cancelSnow = true;
                break;
            default:
                // error
                break;
        }

        // Text
        ctx.fillStyle = fontColor;
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
        if (!cancelSnow) {
            snow.forEach(function(flake, index) {
                var s = flake.scale;
                if (index < counter) {
                    flake.y += 1;
                    if (gameState.wind && (hRSeconds % 2 === 0)) {
                        flake.x += 3;
                    } else if ((index + counter) % 3 === 0) {
                        flake.x += 0.2;
                    }
                    if (flake.y > (450 / s)) { flake.y = -25; }
                    if (flake.x > (800 / s)) { flake.x = -25; }
                    if (s != 1) {
                        ctx.save();
                        ctx.scale(s, s);
                        ctx.drawImage(flake.sprite, flake.x, flake.y);
                        ctx.restore();
                    } else {
                        ctx.drawImage(flake.sprite, flake.x, flake.y);
                    }
                }
            });
        }
    }
    main();
}());
