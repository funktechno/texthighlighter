    if (localStorage["highlights"]) {
        var serializedHighlights = JSON.parse(localStorage["highlights"]);
    }

    var highlighter;
   // var initialDoc;
    window.onload = function() {
        rangy.init();

        highlighter = rangy.createHighlighter();

        highlighter.addClassApplier(rangy.createClassApplier("highlight", {
            ignoreWhiteSpace: true,
            tagNames: ["span", "a"]
        }));

        if (serializedHighlights) {
            highlighter.deserialize(serializedHighlights);
        }
    };

    function saveHighlights() {
        localStorage["highlights"] = JSON.stringify(highlighter.serialize());
}