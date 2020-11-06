import { optionsImpl } from "./types";
/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 * @memberof TextHighlighter
 * @static
 */
declare function createWrapper(options: optionsImpl): HTMLSpanElement;
/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 * @memberof TextHighlighter
 */
declare const highlightRange: (el: HTMLElement, range: Range, wrapper: {
    cloneNode: (arg0: boolean) => any;
}) => HTMLElement[];
/**
 * highlight selected element
 * @param el
 * @param options
 * @param keepRange
 */
declare const doHighlight: (el: HTMLElement, keepRange: boolean, options?: optionsImpl | undefined) => boolean;
/**
 * Deserializes highlights.
 * @throws exception when can't parse JSON or JSON has invalid structure.
 * @param {object} json - JSON object with highlights definition.
 * @returns {Array} - array of deserialized highlights.
 * @memberof TextHighlighter
 */
declare const deserializeHighlights: (el: HTMLElement, json: string) => {
    appendChild: (arg0: any) => void;
}[];
/**
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
declare const serializeHighlights: (el: HTMLElement | null) => string | undefined;
declare const removeHighlights: (element: HTMLElement, options?: optionsImpl | undefined) => void;
export { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, optionsImpl, createWrapper, highlightRange };
