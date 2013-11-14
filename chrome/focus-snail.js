'use strict';

var ZOOM = 1;
var OFFSET_PX = 1;
var MIN_WIDTH = 12;
var MIN_HEIGHT = 8;

function animationDuration(distance) {
	return Math.pow(inRange(distance, 32, 1024), 1/3) * 50;
}

function easing(x) {
	return 1 - (1 - Math.pow(x, 1/4));
}

function opacityEasing(x) {
	var Q = 4;
	if (x < 1/Q) {
		var y = Q * (-Q*x*x + 2*x);
	} else {
		y = Math.pow(x - 1 - 1/Q, 2);
	}
	return y * 0.4 + 0.2;
}


var keyDownTime = 0;

document.documentElement.addEventListener('keydown', function(event) {
	var code = event.which;
	// Show animation only upon Tab or Arrow keys press.
	if (code === 9 || (code > 36 && code < 41)) {
		keyDownTime = Date.now();
	}
}, false);


var prevFocused = null;
var isFirstFocus = true;
var prev = null;
var current = null;
var animationId = 0;

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

	if (Date.now() - keyDownTime > 42) {
		return;
	}

	if (!svg) {
		initialize();
	}

	onEnd();

	prevFocused = target;

	var left = 0;
	var prevLeft = 0;
	var top = 0;
	var prevTop = 0;
	var isFirstCall = true;

	var distance = euclideanDistance(prev, current);
	var duration = animationDuration(distance);

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
//			var opacity = inRange(opacityEasing(step), 0, 1);
//			polygon.style.opacity = opacity;
		} else {
//			polygon.style.opacity = '';
			onEnd();
		}
	}, duration);

	var isFirstTick = true;
	function tick(_left, _top, _width, _height) {
		if (isFirstTick) {
			isFirstTick = false;
			updateGradient(_left, _top, _width, _height, left, top, current.width, current.height);
		}
		var list = getPointsList({
			top: _top,
			right: _left + _width,
			bottom: _top + _height,
			left: _left
		}, {
			top: top,
			right: left + current.width,
			bottom: top + current.height,
			left: left
		});
		enclose(list, polygon);
	}

	function setup() {
		var scroll = scrollOffset();
		svg.style.left = scroll.left + 'px';
		svg.style.top = scroll.top + 'px';
		svg.setAttribute('width', window.innerWidth);
		svg.setAttribute('height', window.innerHeight);
		svg.classList.add('focus-snail_visible');
		left = current.left - scroll.left;
		prevLeft = prev.left - scroll.left;
		top = current.top - scroll.top;
		prevTop = prev.top - scroll.top;
	}

}, true);


function updateGradient(ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {
	var midA = {
		x: ax + aWidth / 2,
		y: ay + aHeight / 2
	};
	var midB = {
		x: bx + bWidth / 2,
		y: by + bHeight / 2
	};

	var minX = Math.min(midA.x, midB.x);
	var minY = Math.min(midA.y, midB.y);
	
	midA.x -= minX;
	midA.y -= minY;
	midB.x -= minX;
	midB.y -= minY;

	if (maxAt(midA, midB)) {
		return;
	}
	gradient.setAttribute('x1', midA.x);
	gradient.setAttribute('y1', midA.y);
	gradient.setAttribute('x2', midB.x);
	gradient.setAttribute('y2', midB.y);
	console.log(midA, midB);
}

function maxAt(ap, bp) {
	var max = Math.max(ap.x, ap.y, bp.x, bp.y);
	if (max == 0) {
		return true;
	}
	ap.x /= max;
	ap.y /= max;
	bp.x /= max;
	bp.y /= max;
}

var svg = null;
var polygon = null;
var start = null;
var end = null;
var gradient = null;

function initialize() {
	var dict = htmlFragment('<svg id="focus-snail_svg" width="1000" height="800" xmlns:xlink="http://www.w3.org/1999/xlink">\
		<linearGradient id="focus-snail_gradient" spreadMethod="repeat">\
			<stop id="focus-snail_start" offset="0%" stop-color="red" stop-opacity="0"/>\
			<stop id="focus-snail_end" offset="100%" stop-color="red" stop-opacity="1"/>\
		</linearGradient>\
		<polygon id="focus-snail_polygon" fill="url(#focus-snail_gradient)"/>\
	</svg>', 'focus-snail_');
	svg = dict.svg;
	polygon = dict.polygon;
	start = dict.start;
	end = dict.end;
	gradient = dict.gradient;
	document.body.appendChild(svg);
}


function onEnd() {
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = 0;
	}
	//svg.classList.remove('focus-snail_visible');
	prevFocused = null;
}


function euclideanDistance(a ,b) {
	var dx = a.left - b.left;
	var dy = a.top - b.top;
	return Math.sqrt(dx*dx + dy*dy);
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


function getPointsList(a, b) {
	var x = 0;

	if (a.top < b.top)
		x = 1;

	if (a.right > b.right)
		x += 2;

	if (a.bottom > b.bottom)
		x += 4;

	if (a.left < b.left)
		x += 8;

	var dict = [
		[],
		[0, 1],
		[1, 2],
		[0, 1, 2],
		[2, 3],
		[0, 1], // FIXME: do two polygons
		[1, 2, 3],
		[0, 1, 2, 3],
		[3, 0],
		[3, 0, 1],
		[3, 0], // FIXME: do two polygons
		[3, 0, 1, 2],
		[2, 3, 0],
		[2, 3, 0, 1],
		[1, 2, 3, 0],
		[0, 1, 2, 3, 0]
	];

	var points = rectPoints(a).concat(rectPoints(b));
	var list = [];
	var indexes = dict[x];
	for (var i = 0; i < indexes.length; i++) {
		list.push(points[indexes[i]]);
	}
	while (i--) {
		list.push(points[indexes[i] + 4]);
	}
	return list;
}


function enclose(list, polygon) {
	polygon.points.clear();
	for (var i = 0; i < list.length; i++) {
		var p = list[i];
		addPoint(polygon, p);
	}
}


function addPoint(polygon, point) {
	var pt = svg.createSVGPoint();
	pt.x = point.x;
	pt.y = point.y;
	polygon.points.appendItem(pt);
}


function rectPoints(rect) {
	return [
		{
			x: rect.left,
			y: rect.top
		},
		{
			x: rect.right,
			y: rect.top
		},
		{
			x: rect.right,
			y: rect.bottom
		},
		{
			x: rect.left,
			y: rect.bottom
		}
	]
}


function htmlFragment(content, prefix) {
	var dummy = document.createElement('div');
	dummy.innerHTML = content;
	var all = dummy.querySelectorAll('*');
	var result = {};
	for (var i = 0; i < all.length; i++) {
		var element = all[i];
		var id = element.id;
		if (prefix) {
			id = id.slice(prefix.length);
		}
		result[id] = element;
	}
	return result;
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
