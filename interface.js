// import { createButton } from "./util.js";
// import { gameState as state } from "./state.js";

// Button creation for user interface
function interface() {
	"use strict";
	createButton(state.wait, "Wait");
	createButton(state.walk, "Walk", "fatigue");
	createButton(state.run, "Run", "fatigue");
	createButton(state.yell, "Yell", "fatigue");
	createButton(state.reset, "Reset", "special");
}
