import { optionsImpl, paramsImp } from "./types";
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
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 * @memberof TextHighlighter
 */
export declare const flattenNestedHighlights: (highlights: any[]) => void;
/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 * @memberof TextHighlighter
 */
export declare const mergeSiblingHighlights: (highlights: any[]) => void;
/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 * @memberof TextHighlighter
 */
export declare const normalizeHighlights: (highlights: any[]) => any;
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
export declare const find: (el: HTMLElement, text: string, caseSensitive: boolean, options?: optionsImpl | undefined) => void;
/**
 * Returns highlights from given container.
 * @param params
 * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
 * highlighter is applied to.
 * @param {boolean} [params.andSelf] - if set to true and container is a highlight itself, add container to
 * returned results. Default: true.
 * @param {boolean} [params.grouped] - if set to true, highlights are grouped in logical groups of highlights added
 * in the same moment. Each group is an object which has got array of highlights, 'toString' method and 'timestamp'
 * property. Default: false.
 * @returns {Array} - array of highlights.
 * @memberof TextHighlighter
 */
export declare const getHighlights: (el: HTMLElement, params?: paramsImp | undefined) => any[] | undefined;
/**
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
declare const serializeHighlights: (el: HTMLElement | null) => string | undefined;
declare const removeHighlights: (element: HTMLElement, options?: optionsImpl | undefined) => void;
export { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, createWrapper, highlightRange };
