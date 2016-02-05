// Utility functions for A Walk in the Woods

// Smoothing irregular text arrays
function flatten(arr) {
	"use strict";
	var flatArr = [];
	function process(arr) {
		arr.forEach(function(entry) {
			if (typeof entry === "string") {
				newArr.push(entry);
			} else {
				return process(entry);
			}
		});
	}
	flatten(arr);
	return newArr;
}

// Button factory - val = button text, cls = class
function createButton(f, val, cls) {
	var button = document.createElement("input");
	if (cls) { button.class = cls; }
	button.type = "button";
	button.value = val;
	button.onclick = f;
	document.body.appendChild(button);
}

// export statement for ES6(7?) modules
// export { flatten, createButton };
