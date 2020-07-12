import { optionsI, highlightI } from "./TextHighlighterUtils";
/**
 * Creates TextHighlighter instance and binds to given DOM elements.
 * @param {HTMLElement} element - DOM element to which highlighted will be applied.
 * @param {object} [options] - additional options.
 * @param {string} options.color - highlight color.
 * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
 * @param {string} options.contextClass - class added to element to which highlighter is applied,
 *  'highlighter-context' by default.
 * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
 *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
 * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
 *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
 * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
 * wrappers is passed as param.
 * @class TextHighlighter
 */
declare function TextHighlighter(this: highlightI, element: HTMLElement, options?: optionsI): highlightI;
declare namespace TextHighlighter {
    var createWrapper: (options: {
        color: string;
        highlightedClass: string;
    }) => HTMLSpanElement;
}
export { TextHighlighter };
