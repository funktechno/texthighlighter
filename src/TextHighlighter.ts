import { createWrapper, deserializeHighlights, doHighlight, find, flattenNestedHighlights, getHighlights, highlightRange, mergeSiblingHighlights, normalizeHighlights, removeHighlights, serializeHighlights } from "./Library";
import { optionsImpl, paramsImp, TextHighlighterSelf, TextHighlighterType } from "./types";
import { bindEvents, DATA_ATTR, defaults, dom, NODE_TYPE, unbindEvents } from "./Utils";

const TextHighlighter: TextHighlighterType = function (this: TextHighlighterSelf, element: HTMLElement, options?: optionsImpl) {

    if (!element) {
        throw "Missing anchor element";
    }

    this.el = element;
    this.options = defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",
        onRemoveHighlight: function () { return true; },
        onBeforeHighlight: function () { return true; },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function (...e: any[]) {
            return true;
        }
    });
    if (this.options && this.options.contextClass)
        dom(this.el).addClass(this.options.contextClass);
    bindEvents(this.el, this);
    return this;
};

/**
 * Permanently disables highlighting.
 * Unbinds events and remove context element class.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.destroy = function () {
    unbindEvents(this.el, this);
    dom(this.el).removeClass(this.options.contextClass);
};

TextHighlighter.prototype.highlightHandler = function () {
    this.doHighlight();
};

TextHighlighter.prototype.doHighlight = function (keepRange: boolean) {
    doHighlight(this.el, keepRange, this.options);
};

TextHighlighter.prototype.highlightRange = function (range: Range, wrapper: { cloneNode: (arg0: boolean) => any }) {
    highlightRange(this.el, range, wrapper);
};

TextHighlighter.prototype.normalizeHighlights = function (highlights: any[]) {
    normalizeHighlights(highlights);
};

TextHighlighter.prototype.flattenNestedHighlights = function (highlights: any[]) {
    flattenNestedHighlights(highlights);
};

TextHighlighter.prototype.mergeSiblingHighlights = function (highlights: any[]) {
    mergeSiblingHighlights(highlights);
};

TextHighlighter.prototype.setColor = function (color: string) {
    this.options.color = color;
};

TextHighlighter.prototype.getColor = function () {
    return this.options.color;
};

TextHighlighter.prototype.removeHighlights = function (element: HTMLElement) {
    const container = element || this.el;
    removeHighlights(container, this.options);
};

TextHighlighter.prototype.getHighlights = function (params?: paramsImp) {
    getHighlights(this.el, params);
};

TextHighlighter.prototype.isHighlight = function (el: HTMLElement) {
    return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
};

TextHighlighter.prototype.serializeHighlights = function () {
    return serializeHighlights(this.el);
};

TextHighlighter.prototype.deserializeHighlights = function (json: string) {
    deserializeHighlights(this.el, json);
};

TextHighlighter.prototype.find = function (text: string, caseSensitive: boolean) {
    find(this.el, text, caseSensitive);
};

(TextHighlighter as any).createWrapper = function (options: optionsImpl) {
    createWrapper(options);
};

export { TextHighlighter };
