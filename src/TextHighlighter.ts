import { doHighlight, highlightRange } from "./Library";
import { optionsImpl } from "./types";
import { bindEvents, defaults, dom, unbindEvents } from "./Utils";

interface TextHighlighterSelf {
    el?: HTMLElement;
    options?: optionsImpl;
}

type TextHighlighterType = (element: HTMLElement, options: optionsImpl) => void;


const TextHighlighter: TextHighlighterType = function (this: TextHighlighterSelf, element: HTMLElement, options: optionsImpl) {

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

TextHighlighter.prototype.highlightRange = function (range: Range, wrapper: { cloneNode: (arg0: boolean) => any}) {
    highlightRange(this.el,range,wrapper);
};

export { TextHighlighter };
