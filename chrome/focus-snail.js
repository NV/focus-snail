'use strict';

var DURATION = 300;
var ZOOM = 1;
var OFFSET_PX = 1;
var MIN_WIDTH = 12;
var MIN_HEIGHT = 8;

var polygons = {
	top: null,
	right: null,
	bottom: null,
	left: null
};

var svg = null;
var SVGNS = 'http://www.w3.org/2000/svg';
function initialize(doc) {
	svg = document.createElementNS(SVGNS, 'svg');
	svg.id = 'focus-snail';
	var properties = ['top', 'right', 'bottom', 'left'];
	for (var i = 0; i < 4; i++) {
		var polygon = doc.createElementNS(SVGNS, 'polygon');
		polygon.classList.add('focus-snail_polygon');
		for (var j = 0; j < 4; j++) {
			var point = svg.createSVGPoint();
			polygon.points.appendItem(point);
		}
		svg.appendChild(polygon);
		polygons[properties[i]] = polygon;
	}
	doc.body.appendChild(svg);
}


function scrollOffset() {
	var win = document.defaultView;
	var docElem = document.documentElement;
	var body = document.body;
	var top = win.pageYOffset || docElem.scrollTop  || body.scrollTop;
	var left = win.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	return {
		top: top,
		left: left
	};
}

function offsetOf(elem) {
	var rect = elem.getBoundingClientRect();
	var docElem = document.documentElement;
	var body = document.body;

	var scroll = scrollOffset();

	var clientTop  = docElem.clientTop  || body.clientTop  || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,
		top  = rect.top  + scroll.top  - clientTop,
		left = rect.left + scroll.left - clientLeft;

	return {top: top, left: left};
}

var prevFocused = null;
var isFirstFocus = true;
var keyDownTime = 0;

document.documentElement.addEventListener('keydown', function(event) {
	var code = event.which;
	// Show animation only upon Tab or Arrow keys press.
	if (code === 9 || (code > 36 && code < 41)) {
		keyDownTime = Date.now();
	}
}, false);

var prev = null;
var current = null;
var animationId = 0;


function enclose(b, a, polygon) {
	var connections = {
		top: true,
		right: true,
		bottom: true,
		left: true
	};

	if (a.left <= b.left) {
		connections.left = false;
	}

	if (a.right >= b.right) {
		connections.right = false;
	}

	if (a.top <= b.top) {
		connections.top = false;
	}

	if (a.bottom >= b.bottom) {
		connections.bottom = false;
	}

	function connectSide(polygon, a1, a2, b1, b2) {
		polygon.points.clear();
		addPoint(polygon, a1);
		addPoint(polygon, a2);
		addPoint(polygon, b2);
		addPoint(polygon, b1);
	}

	var ap = [
		{x: a.left, y: a.top},
		{x: a.right, y: a.top},
		{x: a.right, y: a.bottom},
		{x: a.left, y: a.bottom}
	];
	var bp = [
		{x: b.left, y: b.top},
		{x: b.right, y: b.top},
		{x: b.right, y: b.bottom},
		{x: b.left, y: b.bottom}
	];

	var props = ['top', 'right', 'bottom', 'left'];
	for (var i = 0; i < 4; i++) {
		var j = (i + 1) % 4;
		var side = props[i];
		if (connections[side]) {
			connectSide(polygon[side], ap[i], ap[j], bp[i], bp[j]);
		} else {
			polygon[side].points.clear();
		}
	}
}


function addPoint(polygon, point) {
	var pt = polygon.ownerSVGElement.createSVGPoint();
	pt.x = point.x;
	pt.y = point.y;
	polygon.points.appendItem(pt);
}


document.documentElement.addEventListener('focus', function(event) {
	var target = event.target;
	if (target.id === 'focus-snail') {
		return;
	}
	var offset = offsetOf(target);
	prev = current;
	current = {
		left: offset.left - OFFSET_PX,
		top: offset.top - OFFSET_PX,
		width: Math.max(MIN_WIDTH, target.offsetWidth) + 2*OFFSET_PX,
		height: Math.max(MIN_HEIGHT, target.offsetHeight) + 2*OFFSET_PX
	};

	if (isFirstFocus) {
		isFirstFocus = false;
		return;
	}

	if (now() - keyDownTime > 42) {
		return;
	}

	if (!svg) {
		initialize(document);
	}

	onEnd();
	svg.classList.add('focus-snail_visible');

	prevFocused = target;

	var left = 0;
	var prevLeft = 0;
	var top = 0;
	var prevTop = 0;
	var isFirstCall = true;

	animate(function(step) {
		if (isFirstCall) {
			setup();
			isFirstCall = false;
		}

		var e = easing(step);
		tick(
			between(prevLeft + (prev.width - ZOOM * prev.width)  / 2, left, e),
			between(prevTop + (prev.height - ZOOM * prev.height) / 2, top, e),
			between(ZOOM * prev.width,  current.width,  e),
			between(ZOOM * prev.height, current.height, e)
		);

		if (step < 1) {
			var opacity = inRange(opacityEasing(step), 0, 1);
			svg.style.opacity = opacity;
		} else {
			svg.style.opacity = '';
			onEnd();
		}
	}, DURATION);

	function tick(_left, _top, _width, _height) {
		enclose({
			top: _top,
			right: _left + _width,
			bottom: _top + _height,
			left: _left
		}, {
			top: top,
			right: left + current.width,
			bottom: top + current.height,
			left: left
		}, polygons);
	}

	function setup() {
		var scroll = scrollOffset();
		svg.style.left = scroll.left + 'px';
		svg.style.top = scroll.top + 'px';
		svg.setAttribute('width', window.innerWidth);
		svg.setAttribute('height', window.innerHeight);
		left = current.left - scroll.left;
		prevLeft = prev.left - scroll.left;
		top = current.top - scroll.top;
		prevTop = prev.top - scroll.top;
	}

}, true);


function onEnd() {
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = 0;
	}
	svg.classList.remove('focus-snail_visible');
	prevFocused = null;
}

function now() {
	return new Date().valueOf();
}

function inRange(value, from, to) {
	if (value <= from) {
		return from;
	}
	if (value >= to) {
		return to;
	}
	return value;
}

function between(from, to, value) {
	if (value <= 0) {
		return from;
	}
	if (value >= 1) {
		return to;
	}
	return from * (1 - value) + to * value;
}


function animate(onStep, duration) {
	var start = Date.now();
	(function loop() {
		animationId = requestAnimationFrame(function() {
			var diff = Date.now() - start;
			var x = diff / duration;
			onStep(x);
			if (diff < duration) {
				loop();
			}
		});
	})();
}


function easing(x) {
	return 1 - (1 - Math.pow(x, 1/4));
}
function opacityEasing(x) {
	return (1 - squareOut(x)) * 0.7 + 0.1;
}
function squareOut(x) {
	return -x*x + 2 * x;
}
