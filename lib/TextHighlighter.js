"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlighter = void 0;
var Library_1 = require("./Library");
var Utils_1 = require("./Utils");
var TextHighlighter = function (element, options) {
    if (!element) {
        throw "Missing anchor element";
    }
    this.el = element;
    this.options = Utils_1.defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",
        onRemoveHighlight: function () { return true; },
        onBeforeHighlight: function () { return true; },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        }
    });
    if (this.options && this.options.contextClass)
        Utils_1.dom(this.el).addClass(this.options.contextClass);
    Utils_1.bindEvents(this.el, this);
    return this;
};
exports.TextHighlighter = TextHighlighter;
/**
 * Permanently disables highlighting.
 * Unbinds events and remove context element class.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.destroy = function () {
    Utils_1.unbindEvents(this.el, this);
    Utils_1.dom(this.el).removeClass(this.options.contextClass);
};
TextHighlighter.prototype.highlightHandler = function () {
    this.doHighlight();
};
TextHighlighter.prototype.doHighlight = function (keepRange) {
    Library_1.doHighlight(this.el, keepRange, this.options);
};
TextHighlighter.prototype.highlightRange = function (range, wrapper) {
    Library_1.highlightRange(this.el, range, wrapper);
};
TextHighlighter.prototype.normalizeHighlights = function (highlights) {
    Library_1.normalizeHighlights(highlights);
};
TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {
    Library_1.flattenNestedHighlights(highlights);
};
TextHighlighter.prototype.mergeSiblingHighlights = function (highlights) {
    Library_1.mergeSiblingHighlights(highlights);
};
TextHighlighter.prototype.setColor = function (color) {
    this.options.color = color;
};
TextHighlighter.prototype.getColor = function () {
    return this.options.color;
};
TextHighlighter.prototype.removeHighlights = function (element) {
    Library_1.removeHighlights(element, this.options);
};
TextHighlighter.prototype.getHighlights = function (params) {
    Library_1.getHighlights(this.el, params);
};
TextHighlighter.prototype.isHighlight = function (el) {
    return el && el.nodeType === Utils_1.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(Utils_1.DATA_ATTR);
};
TextHighlighter.prototype.serializeHighlights = function () {
    Library_1.serializeHighlights(this.el);
};
TextHighlighter.prototype.deserializeHighlights = function (json) {
    Library_1.deserializeHighlights(this.el, json);
};
TextHighlighter.prototype.find = function (text, caseSensitive) {
    Library_1.find(this.el, text, caseSensitive);
};
TextHighlighter.createWrapper = function (options) {
    Library_1.createWrapper(options);
};
