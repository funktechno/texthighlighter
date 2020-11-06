import { optionsImpl } from "./types";
import { bindEvents, defaults, dom } from "./Utils";

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
// class TextHighlighter:TextHighlighterType{

// }

export { TextHighlighter };
