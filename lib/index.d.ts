import { optionsImpl } from "./TextHighlighterUtils";
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
export { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, optionsImpl };
