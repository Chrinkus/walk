//import { MESSAGES } from "./messages.js";
//import { flatten, createButton } from "./util.js";
//import { gameState } from "./state.js";
//import { Flake, fillSnow } from "./snow.js";

(function() {
    "use strict";
    // Init
    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    var msCount = 0;
    var cancelSnow = false;

    // Global settings
    var fontSize = 24;
    var fontColor = "#FFF";
    ctx.font = fontSize + "px sans-serif";

    // Snow
    var snow = fillSnow(50);

    // Buttons
    createButton(gameState.wait, "Wait");
    createButton(gameState.walk, "Walk", "fatigue");
    createButton(gameState.run, "Run", "fatigue");
    createButton(gameState.yell, "Yell", "fatigue");
    createButton(gameState.reset, "Reset", "special");

    function main() {
        window.requestAnimationFrame(draw);
        var timeStamp = new Date();
        msCount = timeStamp.getMilliseconds() % 1000;

        // Reset canvas
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
                // Increase snow amount
                break;
            case "wolf":
                ctx.fillStyle = "#F00";
                ctx.fillRect(0, 0, 800, 450);
                break;
            case "cabin":
                var flicker = ((msCount / 1000 * 60) + 60);
                var cabinLingrad = ctx.createLinearGradient(0, flicker, 0, 450);
                cabinLingrad.addColorStop(0.4, "#930");
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
}());
