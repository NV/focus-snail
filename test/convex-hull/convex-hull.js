attachPair(document.getElementById('a'), document.getElementById('b'));
attachPair(document.getElementById('c'), document.getElementById('d'));
attachPair(document.getElementById('e'), document.getElementById('f'));


function attachPair(a, b) {
	var polygon = createPolygon();

	draggable(a, {
		onMove: function(e) {
			update(a, b, polygon);
		}
	});
	draggable(b, {
		onMove: function(e) {
			update(a, b, polygon);
		}
	});
	document.body.appendChild(polygon.svg);
	a.classList.add('start');
	b.classList.add('end');
	update(a, b, polygon);
}

function createPolygon() {
	var SVGNS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(SVGNS, 'svg');
	svg.setAttribute('width', 1000);
	svg.setAttribute('height', 1000);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

	var result = {
		svg: svg,
		top: null,
		right: null,
		bottom: null,
		left: null
	};
	var properties = ['top', 'right', 'bottom', 'left'];
	for (var i = 0; i < 4; i++) {
		var polygon = document.createElementNS(SVGNS, 'polygon');
		for (var j = 0; j < 4; j++) {
			var point = svg.createSVGPoint();
			polygon.points.appendItem(point);
		}
		svg.appendChild(polygon);
		result[properties[i]] = polygon;
	}

	return result;
}

function addPoint(polygon, point) {
	var pt = polygon.ownerSVGElement.createSVGPoint();
	pt.x = point.x;
	pt.y = point.y;
	polygon.points.appendItem(pt);
}

var polygon = document.getElementById('polygon');
var points = [];
for (var i = 0; i < polygon.points.numberOfItems; i++) {
	points.push(polygon.points.getItem(i));
}

function draggable(elem, opt) {
	opt || (opt = {});
	elem.addEventListener('mousedown', function(e) {
		var x = 0;
		var y = 0;
		var top = parseInt(elem.style.top || 0);
		var left = parseInt(elem.style.left || 0);
		var isFirst = true;

		function onMove(e) {
			if (isFirst) {
				isFirst = false;
				x = e.clientX;
				y = e.clientY;
				return;
			}
			var currentX = e.clientX;
			var currentY = e.clientY;
			var newTop = Math.max(0, top + (currentY - y));
			var newLeft = Math.max(0, left + (currentX - x));
			elem.style.top = newTop + 'px';
			elem.style.left = newLeft + 'px';
			e.preventDefault();

			opt.onMove && opt.onMove(e);
		}

		function onUp() {
			window.removeEventListener('mousemove', onMove, false);
			window.removeEventListener('mouseup', onUp, false);
		}

		window.addEventListener('mousemove', onMove, false);
		window.addEventListener('mouseup', onUp, false);
		e.preventDefault();
	}, false)
}


function update(a, b, polygon) {
	var ax = parseInt(a.style.left);
	var ay = parseInt(a.style.top);
	var ax2 = ax + a.offsetWidth;
	var ay2 = ay + a.offsetHeight;

	var bx = parseInt(b.style.left);
	var by = parseInt(b.style.top);
	var bx2 = bx + b.offsetWidth;
	var by2 = by + b.offsetHeight;

	enclose({
		left: ax,
		right: ax2,
		top: ay,
		bottom: ay2
	}, {
		left: bx,
		right: bx2,
		top: by,
		bottom: by2
	}, polygon);
}


function enclose(a, b, polygon) {
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

	function connectSide(rhomboid, a1, a2, b1, b2) {
		rhomboid.points.clear();
		addPoint(rhomboid, a1);
		addPoint(rhomboid, a2);
		addPoint(rhomboid, b2);
		addPoint(rhomboid, b1);
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


// http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
function covexHull(points) {
	var leftmost = topLeftmost(points);
	var pointOnHull = leftmost;
	var hull = [];
	var length = points.length;
	var i = 0;
	var k = 0;
	do {
		var endpoint = points[i];
		var j = i;
		for (var j = i; j < length; j++) {
			var currentAngle = angle(pointOnHull, endpoint);
			if (currentAngle < prevAngle) {
				k = j;
			}
		}
		prevAngle = currentAngle;
		hull.push(pointOnHull);
		i++;
	} while (endpoint !== leftmost);
	return hull;
}

function angle(a, b) {
	return Math.atan2(b.y - a.y, b.x - a.x);
}

function topLeftmost(points) {
	var j = 0;
	var current = points[j];
	for (var i = 1; i < points.length; i++) {
		var point = points[i];
		if (current.x < point.x && current.y < point.y) {
			current = point;
			j = i;
		}
	}
	points.splice(j, 1);
	return current;
}
