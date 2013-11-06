document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById('focus-snail')) return;

	/*> ../chrome/focus-snail.js */

	var style = document.createElement('style');
	style.textContent = "/*> ../chrome/focus-snail.css */";
	document.body.appendChild(style);
}, false);
