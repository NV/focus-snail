attachPair(doc.getElementById('a'), doc.getElementById('b'));
attachPair(doc.getElementById('c'), doc.getElementById('d'));
attachPair(doc.getElementById('e'), doc.getElementById('f'));

function attachPair(a, b) {
	var struct = createPolygon();
	draggable(a, {
		onMove: function() {
			update(a, b, struct);
		}
	});
	draggable(b, {
		onMove: function() {
			update(a, b, struct);
		}
	});
	body.appendChild(struct.svg);
	a.classList.add('start');
	b.classList.add('end');
	update(a, b, struct);
}


function createPolygon() {
	var html = htmlFragment();
	return {
		svg: getId(html, 'svg'),
		polygon: getId(html, 'polygon'),
		start: getId(html, 'start'),
		end: getId(html, 'end'),
		gradient: getId(html, 'gradient')
	};
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
			win.removeEventListener('mousemove', onMove, false);
			win.removeEventListener('mouseup', onUp, false);
		}

		win.addEventListener('mousemove', onMove, false);
		win.addEventListener('mouseup', onUp, false);
		e.preventDefault();
	}, false)
}


function update(a, b, struct) {
	var ax = parseInt(a.style.left);
	var ay = parseInt(a.style.top);
	var aWidth = a.offsetWidth;
	var aHeight = a.offsetHeight;

	var bx = parseInt(b.style.left);
	var by = parseInt(b.style.top);
	var bWidth = b.offsetWidth;
	var bHeight = b.offsetHeight;

	var list = getPointsList({
		left: ax,
		right: ax + aWidth,
		top: ay,
		bottom: ay + aHeight
	}, {
		left: bx,
		right: bx + bWidth,
		top: by,
		bottom: by + bHeight
	});

	enclose(list, struct.polygon);
	setGradientAngle(struct.gradient, ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight);
}


function enclose(list, polygon) {
	polygon.points.clear();
	for (var i = 0; i < list.length; i++) {
		var p = list[i];
		addPoint(polygon, p);
	}
}
