/**
 * @constructor
 * @extends {Element}
 */
function SVGElement() {}

/**
 * @type SVGSVGElement
 */
SVGSVGElement.prototype.ownerSVGElement;


/**
 * @constructor
 * @extends {SVGElement}
 */
function SVGSVGElement() {}


/**
 * @return SVGPoint
 * @nosideeffects
 */
SVGSVGElement.prototype.createSVGPoint = function() {};



/** @constructor */
function SVGPolygonElement() {}

/** @type {SVGPointList} */
SVGPolygonElement.prototype.points;


/**
 * @constructor
 * @extends {SVGElement}
 */
function SVGLinearGradientElement() {}


/**
 * @constructor
 * @extends {SVGElement}
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
