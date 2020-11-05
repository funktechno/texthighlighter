// TextHighLighterv2 client
import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, optionsImpl } from "../src/index";

interface TextHighlighterType {
    doHighlight: any;
    deserializeHighlights: any;
    serializeHighlights: any;
    removeHighlights: any;
    optionsImpl: any;
}

interface Window {
    TextHighlighter: TextHighlighterType;
}


const TextHighlighter: TextHighlighterType = {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl
};

declare let window: Window;
window.TextHighlighter = TextHighlighter;
