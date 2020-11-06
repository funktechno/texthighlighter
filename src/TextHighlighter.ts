import { optionsImpl } from "./types";

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
        onAfterHighlight: function () { }
    });
    if (this.options)
        dom(this.el).addClass(this.options.contextClass);
    bindEvents(this.el, this);
};
// class TextHighlighter:TextHighlighterType{

// }

export { TextHighlighter };
