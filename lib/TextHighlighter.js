// (function (global) {
// TextHighlighter (archived, not working)
// original file first converted to typescript that doesn't throw any lint errors. 
// Had issues doing a new class of it so extracted methods and clean functions into utils file
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlighter = void 0;
var TextHighlighterUtils_1 = require("./TextHighlighterUtils");
// { highlightHandler: { bind: (arg0: any) => any }}
function bindEvents(el, scope) {
    el.addEventListener("mouseup", scope.highlightHandler.bind(scope));
    el.addEventListener("touchend", scope.highlightHandler.bind(scope));
}
function unbindEvents(el, scope) {
    el.removeEventListener("mouseup", scope.highlightHandler.bind(scope));
    el.removeEventListener("touchend", scope.highlightHandler.bind(scope));
}
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
function TextHighlighter(element, options) {
    var _a;
    if (!element) {
        throw "Missing anchor element";
    }
    this.el = element;
    this.options = TextHighlighterUtils_1.defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",
        onRemoveHighlight: function () {
            return true;
        },
        onBeforeHighlight: function () {
            return true;
        },
        onAfterHighlight: function () {
            return true;
        }
    });
    if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.contextClass)
        TextHighlighterUtils_1.dom(this.el).addClass(this.options.contextClass);
    bindEvents(this.el, this);
    return this;
}
exports.TextHighlighter = TextHighlighter;
/**
 * Permanently disables highlighting.
 * Unbinds events and remove context element class.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.destroy = function () {
    unbindEvents(this.el, this);
    TextHighlighterUtils_1.dom(this.el).removeClass(this.options.contextClass);
};
TextHighlighter.prototype.highlightHandler = function () {
    this.doHighlight();
};
/**
 * Highlights current range.
 * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.doHighlight = function (keepRange) {
    var range = TextHighlighterUtils_1.dom(this.el).getRange();
    var wrapper, createdHighlights, normalizedHighlights, timestamp;
    if (!range || range.collapsed) {
        return;
    }
    if (this.options.onBeforeHighlight(range) === true) {
        timestamp = (+new Date()).toString();
        wrapper = TextHighlighter.createWrapper(this.options);
        wrapper.setAttribute(TextHighlighterUtils_1.TIMESTAMP_ATTR, timestamp);
        createdHighlights = this.highlightRange(range, wrapper);
        normalizedHighlights = this.normalizeHighlights(createdHighlights);
        this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
    }
    if (!keepRange) {
        TextHighlighterUtils_1.dom(this.el).removeAllRanges();
    }
};
/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.highlightRange = function (range, wrapper) {
    if (!range || range.collapsed) {
        return [];
    }
    var result = TextHighlighterUtils_1.refineRangeBoundaries(range);
    var startContainer = result.startContainer, endContainer = result.endContainer, highlights = [];
    var goDeeper = result.goDeeper, done = false, node = startContainer, highlight, wrapperClone, nodeParent;
    do {
        if (node && goDeeper && node.nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
            if (node.parentNode instanceof HTMLElement &&
                node.parentNode.tagName &&
                node.nodeValue &&
                TextHighlighterUtils_1.IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 &&
                node.nodeValue.trim() !== "") {
                wrapperClone = wrapper.cloneNode(true);
                wrapperClone.setAttribute(TextHighlighterUtils_1.DATA_ATTR, true);
                nodeParent = node.parentNode;
                // highlight if a node is inside the el
                if (TextHighlighterUtils_1.dom(this.el).contains(nodeParent) || nodeParent === this.el) {
                    highlight = TextHighlighterUtils_1.dom(node).wrap(wrapperClone);
                    highlights.push(highlight);
                }
            }
            goDeeper = false;
        }
        if (node === endContainer &&
            endContainer instanceof HTMLElement &&
            !(endContainer.hasChildNodes() && goDeeper)) {
            done = true;
        }
        if (node instanceof HTMLElement &&
            node.tagName &&
            TextHighlighterUtils_1.IGNORE_TAGS.indexOf(node.tagName) > -1) {
            if (endContainer instanceof HTMLElement &&
                endContainer.parentNode === node) {
                done = true;
            }
            goDeeper = false;
        }
        if (goDeeper && node instanceof HTMLElement && node.hasChildNodes()) {
            node = node.firstChild;
        }
        else if (node instanceof HTMLElement && node.nextSibling) {
            node = node.nextSibling;
            goDeeper = true;
        }
        else if (node instanceof HTMLElement) {
            node = node.parentNode;
            goDeeper = false;
        }
    } while (!done);
    return highlights;
};
/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.normalizeHighlights = function (highlights) {
    var normalizedHighlights;
    this.flattenNestedHighlights(highlights);
    this.mergeSiblingHighlights(highlights);
    // omit removed nodes
    normalizedHighlights = highlights.filter(function (hl) {
        return hl.parentElement ? hl : null;
    });
    normalizedHighlights = TextHighlighterUtils_1.unique(normalizedHighlights);
    normalizedHighlights.sort(function (a, b) {
        return a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft;
    });
    return normalizedHighlights;
};
/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {
    var _this = this;
    var again;
    // self = this;
    TextHighlighterUtils_1.sortByDepth(highlights, true);
    var flattenOnce = function () {
        var again = false;
        highlights.forEach(function (hl, i) {
            var parent = hl.parentElement;
            if (parent) {
                var parentPrev = parent.previousSibling, parentNext = parent.nextSibling;
                if (_this.isHighlight(parent)) {
                    if (!TextHighlighterUtils_1.haveSameColor(parent, hl)) {
                        if (!hl.nextSibling && parentNext && parent) {
                            var newLocal = parentNext || parent;
                            if (newLocal) {
                                TextHighlighterUtils_1.dom(hl).insertBefore(newLocal);
                                again = true;
                            }
                        }
                        if (!hl.previousSibling) {
                            var newLocal = parentPrev || parent;
                            if (newLocal) {
                                TextHighlighterUtils_1.dom(hl).insertAfter(newLocal);
                                again = true;
                            }
                        }
                        if (!parent.hasChildNodes()) {
                            TextHighlighterUtils_1.dom(parent).remove();
                        }
                    }
                    else {
                        if (hl && hl.firstChild)
                            parent.replaceChild(hl.firstChild, hl);
                        highlights[i] = parent;
                        again = true;
                    }
                }
            }
        });
        return again;
    };
    do {
        again = flattenOnce();
    } while (again);
};
/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.mergeSiblingHighlights = function (highlights) {
    //   const self = this;
    var _this = this;
    var shouldMerge = function (current, node) {
        return (node &&
            node.nodeType === TextHighlighterUtils_1.NODE_TYPE.ELEMENT_NODE &&
            TextHighlighterUtils_1.haveSameColor(current, node) &&
            _this.isHighlight(node));
    };
    //   : {
    //     previousSibling: any;
    //     nextSibling: any;
    //   }
    highlights.forEach(function (highlight) {
        var prev = highlight.previousSibling, next = highlight.nextSibling;
        if (shouldMerge(highlight, prev)) {
            TextHighlighterUtils_1.dom(highlight).prepend(prev.childNodes);
            TextHighlighterUtils_1.dom(prev).remove();
        }
        if (shouldMerge(highlight, next)) {
            TextHighlighterUtils_1.dom(highlight).append(next.childNodes);
            TextHighlighterUtils_1.dom(next).remove();
        }
        TextHighlighterUtils_1.dom(highlight).normalizeTextNodes();
    });
};
/**
 * Sets highlighting color.
 * @param {string} color - valid CSS color.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.setColor = function (color) {
    this.options.color = color;
};
/**
 * Returns highlighting color.
 * @returns {string}
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.getColor = function () {
    return this.options.color;
};
/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.removeHighlights = function (element) {
    var _this = this;
    var container = element || this.el, highlights = this.getHighlights({ container: container });
    // self = this;
    function mergeSiblingTextNodes(textNode) {
        var prev = textNode.previousSibling, next = textNode.nextSibling;
        if (prev && prev.nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
            TextHighlighterUtils_1.dom(prev).remove();
        }
        if (next && next.nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = textNode.nodeValue + next.nodeValue;
            TextHighlighterUtils_1.dom(next).remove();
        }
    }
    function removeHighlight(highlight) {
        var textNodes = TextHighlighterUtils_1.dom(highlight).unwrap();
        if (textNodes)
            textNodes.forEach(function (node) {
                mergeSiblingTextNodes(node);
            });
    }
    TextHighlighterUtils_1.sortByDepth(highlights, true);
    highlights.forEach(function (hl) {
        if (_this.options.onRemoveHighlight(hl) === true) {
            removeHighlight(hl);
        }
    });
};
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
TextHighlighter.prototype.getHighlights = function (params) {
    params = TextHighlighterUtils_1.defaults(params, {
        container: this.el,
        andSelf: true,
        grouped: false
    });
    if (params.container) {
        var nodeList = params.container.querySelectorAll("[" + TextHighlighterUtils_1.DATA_ATTR + "]");
        var highlights = Array.prototype.slice.call(nodeList);
        if (params.andSelf === true && params.container.hasAttribute(TextHighlighterUtils_1.DATA_ATTR)) {
            highlights.push(params.container);
        }
        if (params.grouped) {
            highlights = TextHighlighterUtils_1.groupHighlights(highlights);
        }
        return highlights;
    }
};
/**
 * Returns true if element is a highlight.
 * All highlights have 'data-highlighted' attribute.
 * @param el - element to check.
 * @returns {boolean}
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.isHighlight = function (el) {
    return (el && el.nodeType === TextHighlighterUtils_1.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(TextHighlighterUtils_1.DATA_ATTR));
};
/**
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.serializeHighlights = function () {
    var highlights = this.getHighlights(), refEl = this.el, hlDescriptors = [];
    function getElementPath(el, refElement) {
        var path = [];
        var childNodes;
        if (el)
            do {
                if (el instanceof HTMLElement && el.parentNode) {
                    childNodes = Array.prototype.slice.call(el.parentNode.childNodes);
                    path.unshift(childNodes.indexOf(el));
                    el = el.parentNode;
                }
            } while (el !== refElement || !el);
        return path;
    }
    TextHighlighterUtils_1.sortByDepth(highlights, false);
    //   {
    //     textContent: string | any[];
    //     cloneNode: (arg0: boolean) => any;
    //     previousSibling: { nodeType: number; length: number };
    //   }
    highlights.forEach(function (highlight) {
        if (highlight && highlight.textContent) {
            var offset = 0, // Hl offset from previous sibling within parent node.
            wrapper = highlight.cloneNode(true);
            var length_1 = highlight.textContent.length, hlPath = getElementPath(highlight, refEl);
            if (wrapper instanceof HTMLElement) {
                wrapper.innerHTML = "";
                wrapper = wrapper.outerHTML;
            }
            if (highlight.previousSibling &&
                highlight.previousSibling.nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
                offset = highlight.previousSibling.childNodes.length;
            }
            hlDescriptors.push([
                wrapper,
                highlight.textContent,
                hlPath.join(":"),
                offset,
                length_1
            ]);
        }
    });
    return JSON.stringify(hlDescriptors);
};
/**
 * Deserializes highlights.
 * @throws exception when can't parse JSON or JSON has invalid structure.
 * @param {object} json - JSON object with highlights definition.
 * @returns {Array} - array of deserialized highlights.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.deserializeHighlights = function (json) {
    var hlDescriptors;
    var highlights = [];
    //    const self = this;
    if (!json) {
        return highlights;
    }
    try {
        hlDescriptors = JSON.parse(json);
    }
    catch (e) {
        throw "Can't parse JSON: " + e;
    }
    function deserializationFn(hlDescriptor) {
        var hl = {
            wrapper: hlDescriptor[0],
            text: hlDescriptor[1],
            path: hlDescriptor[2].split(":"),
            offset: hlDescriptor[3],
            length: hlDescriptor[4]
        };
        var elIndex = hl.path.pop(), node = this.el, highlight, idx;
        while ((idx = hl.path.shift())) {
            node = node.childNodes[idx];
        }
        if (node.childNodes[elIndex - 1] &&
            node.childNodes[elIndex - 1].nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
            elIndex -= 1;
        }
        node = node.childNodes[elIndex];
        var hlNode = node.splitText(hl.offset);
        hlNode.splitText(hl.length);
        if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
            TextHighlighterUtils_1.dom(hlNode.nextSibling).remove();
        }
        if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
            TextHighlighterUtils_1.dom(hlNode.previousSibling).remove();
        }
        if (hl && hl.wrapper) {
            var tmpHtml = TextHighlighterUtils_1.dom(hlNode).fromHTML(hl.wrapper)[0];
            if (tmpHtml) {
                highlight = TextHighlighterUtils_1.dom(hlNode).wrap(tmpHtml);
                highlights.push(highlight);
            }
        }
    }
    hlDescriptors.forEach(function (hlDescriptor) {
        try {
            deserializationFn(hlDescriptor);
        }
        catch (e) {
            if (console && console.warn) {
                console.warn("Can't deserialize highlight descriptor. Cause: " + e);
            }
        }
    });
    return highlights;
};
/**
 * Finds and highlights given text.
 * @param {string} text - text to search for
 * @param {boolean} [caseSensitive] - if set to true, performs case sensitive search (default: true)
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.find = function (text, caseSensitive) {
    // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
    var wnd = TextHighlighterUtils_1.dom(this.el).getWindow(), scrollX = wnd.scrollX, scrollY = wnd.scrollY, caseSens = typeof caseSensitive === "undefined" ? true : caseSensitive;
    TextHighlighterUtils_1.dom(this.el).removeAllRanges();
    // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
    var body = wnd.document.body;
    if (wnd && wnd.find) {
        while (wnd.find(text, caseSens)) {
            this.doHighlight(true);
        }
    }
    else if (wnd && body && body.createTextRange) {
        var textRange = body.createTextRange();
        textRange.moveToElementText(this.el);
        while (textRange.findText(text, 1, caseSens ? 4 : 0)) {
            if (!TextHighlighterUtils_1.dom(this.el).contains(textRange.parentElement()) &&
                textRange.parentElement() !== this.el) {
                break;
            }
            textRange.select();
            this.doHighlight(true);
            textRange.collapse(false);
        }
    }
    TextHighlighterUtils_1.dom(this.el).removeAllRanges();
    if (wnd)
        wnd.scrollTo(scrollX, scrollY);
};
/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 * @memberof TextHighlighter
 * @static
 */
TextHighlighter.createWrapper = function (options) {
    var span = document.createElement("span");
    span.style.backgroundColor = options.color;
    span.className = options.highlightedClass;
    return span;
};
