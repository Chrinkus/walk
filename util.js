// Utility functions for A Walk in the Woods

// Smoothing irregular text arrays
function flatten(lumpyArr) {
	"use strict";
	var flatArr = [];
	function process(arr) {
		arr.forEach(function(entry) {
			if (typeof entry === "string") {
				flatArr.push(entry);
			} else {
				return process(entry);
			}
		});
	}
	process(lumpyArr);
	return flatArr;
}

// Button factory - val = button text, cls = class
function createButton(f, val, cls) {
	var button = document.createElement("input");
	if (cls) { button.className = cls; }
	button.type = "button";
	button.value = val;
	button.onclick = f;
	document.getElementById("action").appendChild(button);
}

// export statement for ES6(7?) modules
// export { flatten, createButton };
