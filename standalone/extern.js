/**
 * @constructor
 * @extends {Element}
 */
function SVGSVGElement() {}


/**
 * @return SVGPoint
 * @nosideeffects
 * */
SVGSVGElement.prototype.createSVGPoint = function() {};



/** @constructor */
function SVGPolygonElement() {}

/** @type {SVGPointList} */
SVGPolygonElement.prototype.points;


/**
 * @constructor
 * @extends {Element}
 */
function SVGLinearGradientElement() {}


/**
 * @constructor
 * @extends {Element}
 */
function SVGStopElement() {}


/** @constructor */
function SVGPointList() {}

/** @param {SVGPoint} item */
SVGPointList.prototype.appendItem = function(item) {};
SVGPointList.prototype.clear = function() {};


/** @constructor */
function SVGPoint() {}


/**
 * @param {number} animationId
 */
function cancelAnimationFrame(animationId) {}

/** @type {DOMTokenList} */
Element.prototype.classList;
