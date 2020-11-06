// TextHighLighterv2 client
import { TextHighlighterType } from "../src/types";
import { TextHighlighter } from "../src";

interface Window {
    TextHighlighter: TextHighlighterType;
}

declare let window: Window;
window.TextHighlighter = TextHighlighter;
