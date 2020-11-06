// TextHighLighterv2 client
import { TextHighlighterI } from "../src/types";
import { TextHighlighter } from "../src";

interface Window {
    TextHighlighter: TextHighlighterI;
}

declare let window: Window;
window.TextHighlighter = TextHighlighter;
