import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, optionsImpl, createWrapper, highlightRange } from "../src/Library";
import { TextHighlighterType } from "./types";

export {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl,
    createWrapper,
    highlightRange
};

export const TextHighlighter: TextHighlighterType = {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl
};