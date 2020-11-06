import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, createWrapper, highlightRange } from "../src/Library";
import { optionsImpl, TextHighlighterI } from "./types";

export {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl,
    createWrapper,
    highlightRange
};

export const TextHighlighter: TextHighlighterI = {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl
};