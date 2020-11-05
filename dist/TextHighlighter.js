(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TextHighLighterv2 client
var index_1 = require("../src/index");
// declare const TextHighlighter: TextHighlighterType;
var TextHighlighter = {
    doHighlight: index_1.doHighlight,
    deserializeHighlights: index_1.deserializeHighlights,
    serializeHighlights: index_1.serializeHighlights,
    removeHighlights: index_1.removeHighlights,
    optionsImpl: index_1.optionsImpl
};
window.TextHighlighter = TextHighlighter;
// globalThis/* or window */.TextHighlighter = TextHighlighter;

},{"../src/index":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsImp = exports.optionsImpl = exports.activator = exports.groupHighlights = exports.defaults = exports.highlightI = exports.haveSameColor = exports.unique = exports.sortByDepth = exports.refineRangeBoundaries = exports.dom = exports.IGNORE_TAGS = exports.NODE_TYPE = exports.TIMESTAMP_ATTR = exports.DATA_ATTR = void 0;
// eslint-disable-next-line @typescript-eslint/class-name-casing
var highlightI = /** @class */ (function () {
    function highlightI() {
    }
    return highlightI;
}());
exports.highlightI = highlightI;
// eslint-disable-next-line @typescript-eslint/class-name-casing
var optionsImpl = /** @class */ (function () {
    function optionsImpl() {
    }
    return optionsImpl;
}());
exports.optionsImpl = optionsImpl;
// class containerI{
//     querySelectorAll: (arg0: string): any;
//     hasAttribute: (arg0: string) => any;
// }
// eslint-disable-next-line @typescript-eslint/class-name-casing
var paramsImp = /** @class */ (function () {
    function paramsImp() {
    }
    return paramsImp;
}());
exports.paramsImp = paramsImp;
var /**
   * Attribute added by default to every highlight.
   * @type {string}
   */ DATA_ATTR = "data-highlighted", 
/**
 * Attribute used to group highlight wrappers.
 * @type {string}
 */
TIMESTAMP_ATTR = "data-timestamp", NODE_TYPE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
}, 
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */
IGNORE_TAGS = [
    "SCRIPT",
    "STYLE",
    "SELECT",
    "OPTION",
    "BUTTON",
    "OBJECT",
    "APPLET",
    "VIDEO",
    "AUDIO",
    "CANVAS",
    "EMBED",
    "PARAM",
    "METER",
    "PROGRESS"
];
exports.DATA_ATTR = DATA_ATTR;
exports.TIMESTAMP_ATTR = TIMESTAMP_ATTR;
exports.NODE_TYPE = NODE_TYPE;
exports.IGNORE_TAGS = IGNORE_TAGS;
function activator(type) {
    return new type();
}
exports.activator = activator;
/**
 * Groups given highlights by timestamp.
 * @param {Array} highlights
 * @returns {Array} Grouped highlights.
 */
function groupHighlights(highlights) {
    var order = [], chunks = {}, grouped = [];
    highlights.forEach(function (hl) {
        var timestamp = hl.getAttribute(TIMESTAMP_ATTR);
        if (typeof chunks[timestamp] === "undefined") {
            chunks[timestamp] = [];
            order.push(timestamp);
        }
        chunks[timestamp].push(hl);
    });
    order.forEach(function (timestamp) {
        var group = chunks[timestamp];
        grouped.push({
            chunks: group,
            timestamp: timestamp,
            toString: function () {
                return group
                    .map(function (h) {
                    return h.textContent;
                })
                    .join("");
            }
        });
    });
    return grouped;
}
exports.groupHighlights = groupHighlights;
/**
 * Fills undefined values in obj with default properties with the same name from source object.
 * @param {object} obj - target object, can't be null, must be initialized first
 * @param {object} source - source object with default values
 * @returns {object}
 */
function defaults(obj, source) {
    for (var prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop) &&
            obj[prop] === void 0) {
            obj[prop] = source[prop];
        }
    }
    return obj;
}
exports.defaults = defaults;
/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
    return arr.filter(function (value, idx, self) {
        return self.indexOf(value) === idx;
    });
}
exports.unique = unique;
/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range) {
    var startContainer = range.startContainer, endContainer = range.endContainer, goDeeper = true;
    var ancestor = range.commonAncestorContainer;
    if (range.endOffset === 0) {
        while (endContainer &&
            !endContainer.previousSibling &&
            endContainer.parentNode !== ancestor) {
            endContainer = endContainer.parentNode;
        }
        if (endContainer)
            endContainer = endContainer.previousSibling;
    }
    else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
        if (endContainer &&
            endContainer.nodeValue &&
            range.endOffset < endContainer.nodeValue.length) {
            var t = endContainer;
            t.splitText(range.endOffset);
        }
    }
    else if (range.endOffset > 0) {
        endContainer = endContainer.childNodes.item(range.endOffset - 1);
    }
    if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
        if (startContainer &&
            startContainer.nodeValue &&
            range.startOffset === startContainer.nodeValue.length) {
            goDeeper = false;
        }
        else if (startContainer instanceof Node && range.startOffset > 0) {
            var t = startContainer;
            startContainer = t.splitText(range.startOffset);
            if (startContainer && endContainer === startContainer.previousSibling) {
                endContainer = startContainer;
            }
        }
    }
    else if (range.startOffset < startContainer.childNodes.length) {
        startContainer = startContainer.childNodes.item(range.startOffset);
    }
    else {
        startContainer = startContainer.nextSibling;
    }
    return {
        startContainer: startContainer,
        endContainer: endContainer,
        goDeeper: goDeeper
    };
}
exports.refineRangeBoundaries = refineRangeBoundaries;
/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 */
var dom = function (el) {
    return /** @lends dom **/ {
        /**
         * Adds class to element.
         * @param {string} className
         */
        addClass: function (className) {
            if (el instanceof HTMLElement)
                if (el.classList) {
                    el.classList.add(className);
                }
                else {
                    el.className += " " + className;
                }
        },
        /**
         * Removes class from element.
         * @param {string} className
         */
        removeClass: function (className) {
            if (el instanceof HTMLElement) {
                if (el.classList) {
                    el.classList.remove(className);
                }
                else {
                    el.className = el.className.replace(new RegExp("(^|\\b)" + className + "(\\b|$)", "gi"), " ");
                }
            }
        },
        /**
         * Prepends child nodes to base element.
         * @param {Node[]} nodesToPrepend
         */
        prepend: function (nodesToPrepend) {
            var nodes = Array.prototype.slice.call(nodesToPrepend);
            var i = nodes.length;
            if (el)
                while (i--) {
                    el.insertBefore(nodes[i], el.firstChild);
                }
        },
        /**
         * Appends child nodes to base element.
         * @param {Node[]} nodesToAppend
         */
        append: function (nodesToAppend) {
            if (el) {
                var nodes = Array.prototype.slice.call(nodesToAppend);
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    el.appendChild(nodes[i]);
                }
            }
        },
        /**
         * Inserts base element after refEl.
         * @param {Node} refEl - node after which base element will be inserted
         * @returns {Node} - inserted element
         */
        insertAfter: function (refEl) {
            return refEl.parentNode.insertBefore(el, refEl.nextSibling);
        },
        /**
         * Inserts base element before refEl.
         * @param {Node} refEl - node before which base element will be inserted
         * @returns {Node} - inserted element
         */
        insertBefore: function (refEl) {
            return refEl.parentNode
                ? refEl.parentNode.insertBefore(el, refEl)
                : refEl;
        },
        /**
         * Removes base element from DOM.
         */
        remove: function () {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
                el = null;
            }
        },
        /**
         * Returns true if base element contains given child.
         * @param {Node|HTMLElement} child
         * @returns {boolean}
         */
        contains: function (child) {
            return el && el !== child && el.contains(child);
        },
        /**
         * Wraps base element in wrapper element.
         * @param {HTMLElement} wrapper
         * @returns {HTMLElement} wrapper element
         */
        wrap: function (wrapper) {
            if (el) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(wrapper, el);
                }
                wrapper.appendChild(el);
            }
            return wrapper;
        },
        /**
         * Unwraps base element.
         * @returns {Node[]} - child nodes of unwrapped element.
         */
        unwrap: function () {
            if (el) {
                var nodes = Array.prototype.slice.call(el.childNodes);
                var wrapper_1;
                // debugger;
                nodes.forEach(function (node) {
                    wrapper_1 = node.parentNode;
                    var d = dom(node);
                    if (d && node.parentNode)
                        d.insertBefore(node.parentNode);
                    dom(wrapper_1).remove();
                });
                return nodes;
            }
        },
        /**
         * Returns array of base element parents.
         * @returns {HTMLElement[]}
         */
        parents: function () {
            var parent;
            var path = [];
            if (el) {
                while ((parent = el.parentNode)) {
                    path.push(parent);
                    el = parent;
                }
            }
            return path;
        },
        /**
         * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
         * element node has only one text node.
         * It should does the same as standard element.normalize, but IE implements it incorrectly.
         */
        normalizeTextNodes: function () {
            if (!el) {
                return;
            }
            if (el.nodeType === NODE_TYPE.TEXT_NODE &&
                el.nodeValue &&
                el.parentNode) {
                while (el.nextSibling &&
                    el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                    el.nodeValue += el.nextSibling.nodeValue;
                    el.parentNode.removeChild(el.nextSibling);
                }
            }
            else {
                dom(el.firstChild).normalizeTextNodes();
            }
            dom(el.nextSibling).normalizeTextNodes();
        },
        /**
         * Returns element background color.
         * @returns {CSSStyleDeclaration.backgroundColor}
         */
        color: function () {
            return el instanceof HTMLElement && el.style
                ? el.style.backgroundColor
                : null;
        },
        /**
         * Creates dom element from given html string.
         * @param {string} html
         * @returns {NodeList}
         */
        fromHTML: function (html) {
            var div = document.createElement("div");
            div.innerHTML = html;
            return div.childNodes;
        },
        /**
         * Returns first range of the window of base element.
         * @returns {Range}
         */
        getRange: function () {
            var selection = dom(el).getSelection();
            var range;
            if (selection && selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            }
            return range;
        },
        /**
         * Removes all ranges of the window of base element.
         */
        removeAllRanges: function () {
            var selection = dom(el).getSelection();
            if (selection)
                selection.removeAllRanges();
        },
        /**
         * Returns selection object of the window of base element.
         * @returns {Selection}
         */
        getSelection: function () {
            var win = dom(el).getWindow();
            return win ? win.getSelection() : null;
        },
        /**
         * Returns window of the base element.
         * @returns {Window}
         */
        getWindow: function () {
            var doc = dom(el).getDocument();
            return doc instanceof Document ? doc.defaultView : null;
        },
        /**
         * Returns document of the base element.
         * @returns {HTMLDocument}
         */
        getDocument: function () {
            // if ownerDocument is null then el is the document itself.
            if (el)
                return el.ownerDocument || el;
        }
    };
};
exports.dom = dom;
/**
 * Returns true if elements a i b have the same color.
 * @param {Node} a
 * @param {Node} b
 * @returns {boolean}
 */
function haveSameColor(a, b) {
    return dom(a).color() === dom(b).color();
}
exports.haveSameColor = haveSameColor;
/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
function sortByDepth(arr, descending) {
    arr.sort(function (a, b) {
        return (dom(descending ? b : a).parents().length -
            dom(descending ? a : b).parents().length);
    });
}
exports.sortByDepth = sortByDepth;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightRange = exports.createWrapper = exports.optionsImpl = exports.removeHighlights = exports.serializeHighlights = exports.deserializeHighlights = exports.doHighlight = void 0;
// TextHighLighterv2
// Port by: lastlink <https://github.com/lastlink/>
var TextHighlighterUtils_1 = require("./TextHighlighterUtils");
Object.defineProperty(exports, "optionsImpl", { enumerable: true, get: function () { return TextHighlighterUtils_1.optionsImpl; } });
/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 * @memberof TextHighlighter
 * @static
 */
function createWrapper(options) {
    var span = document.createElement("span");
    if (options.color) {
        span.style.backgroundColor = options.color;
        span.setAttribute("data-backgroundcolor", options.color);
    }
    if (options.highlightedClass)
        span.className = options.highlightedClass;
    return span;
}
exports.createWrapper = createWrapper;
/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 * @memberof TextHighlighter
 */
var highlightRange = function (el, range, wrapper) {
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
                if (TextHighlighterUtils_1.dom(el).contains(nodeParent) || nodeParent === el) {
                    highlight = TextHighlighterUtils_1.dom(node).wrap(wrapperClone);
                    highlights.push(highlight);
                }
            }
            goDeeper = false;
        }
        if (node === endContainer &&
            endContainer &&
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
        if (goDeeper &&
            (node instanceof Text || node instanceof HTMLElement) &&
            node.hasChildNodes()) {
            node = node.firstChild;
        }
        else if (node && node.nextSibling) {
            node = node.nextSibling;
            goDeeper = true;
        }
        else if (node) {
            node = node.parentNode;
            goDeeper = false;
        }
    } while (!done);
    return highlights;
};
exports.highlightRange = highlightRange;
// : {
//     nodeType: number;
//     hasAttribute: (arg0: string) => any;
// }
/**
 * Returns true if element is a highlight.
 * All highlights have 'data-highlighted' attribute.
 * @param el - element to check.
 * @returns {boolean}
 * @memberof TextHighlighter
 */
var isHighlight = function (el) {
    return (el && el.nodeType === TextHighlighterUtils_1.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(TextHighlighterUtils_1.DATA_ATTR));
};
/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 * @memberof TextHighlighter
 */
var flattenNestedHighlights = function (highlights) {
    var again;
    // self = this;
    TextHighlighterUtils_1.sortByDepth(highlights, true);
    var flattenOnce = function () {
        var again = false;
        highlights.forEach(function (hl, i) {
            var parent = hl.parentElement;
            if (parent) {
                var parentPrev = parent.previousSibling, parentNext = parent.nextSibling;
                if (isHighlight(parent)) {
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
var mergeSiblingHighlights = function (highlights) {
    //   const self = this;
    var shouldMerge = function (current, node) {
        return (node &&
            node.nodeType === TextHighlighterUtils_1.NODE_TYPE.ELEMENT_NODE &&
            TextHighlighterUtils_1.haveSameColor(current, node) &&
            isHighlight(node));
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
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 * @memberof TextHighlighter
 */
var normalizeHighlights = function (highlights) {
    var normalizedHighlights;
    flattenNestedHighlights(highlights);
    mergeSiblingHighlights(highlights);
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
 * highlight selected element
 * @param el
 * @param options
 * @param keepRange
 */
var doHighlight = function (el, keepRange, options) {
    var range = TextHighlighterUtils_1.dom(el).getRange();
    var wrapper, createdHighlights, normalizedHighlights, timestamp;
    if (!options)
        options = new TextHighlighterUtils_1.optionsImpl();
    options = TextHighlighterUtils_1.defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRemoveHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onBeforeHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        }
    });
    if (!range || range.collapsed) {
        return false;
    }
    var highlightMade = false;
    if (options.onBeforeHighlight && options.onBeforeHighlight(range) === true) {
        timestamp = (+new Date()).toString();
        wrapper = createWrapper(options);
        wrapper.setAttribute(TextHighlighterUtils_1.TIMESTAMP_ATTR, timestamp);
        createdHighlights = highlightRange(el, range, wrapper);
        if (createdHighlights.length > 0)
            highlightMade = true;
        normalizedHighlights = normalizeHighlights(createdHighlights);
        if (options.onAfterHighlight)
            options.onAfterHighlight(range, normalizedHighlights, timestamp);
    }
    if (!keepRange) {
        TextHighlighterUtils_1.dom(el).removeAllRanges();
    }
    return highlightMade;
};
exports.doHighlight = doHighlight;
/**
 * Deserializes highlights.
 * @throws exception when can't parse JSON or JSON has invalid structure.
 * @param {object} json - JSON object with highlights definition.
 * @returns {Array} - array of deserialized highlights.
 * @memberof TextHighlighter
 */
var deserializeHighlights = function (el, json) {
    var hlDescriptors;
    var highlights = [];
    //    const self = this;
    if (!json) {
        return highlights;
    }
    try {
        // const r = String.raw`${json}`;
        hlDescriptors = JSON.parse(json);
    }
    catch (e) {
        throw "Can't parse JSON: " + e;
    }
    function deserializationFn(hlDescriptor) {
        var hl = hlDescriptor;
        hl.hlpaths = hl.path.split(":").map(Number);
        if (!hl.hlpaths || hl.hlpaths.length == 0)
            return;
        //  {
        //   wrapper: hlDescriptor[0],
        //   text: hlDescriptor[1],
        //   path: hlDescriptor[2].split(":"),
        //   offset: hlDescriptor[3],
        //   length: hlDescriptor[4]
        // };
        var elIndex = hl.hlpaths.pop(), node = el, highlight, idx;
        // should have a value and not be 0 (false is = to 0)
        if (elIndex != 0 && !elIndex)
            return;
        while (hl.hlpaths.length > 0) {
            idx = hl.hlpaths.shift();
            if (idx || idx == 0)
                node = node.childNodes[idx];
        }
        if (node.childNodes[elIndex - 1] &&
            node.childNodes[elIndex - 1].nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE) {
            elIndex -= 1;
        }
        node = node.childNodes[elIndex];
        if (node instanceof Text) {
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
exports.deserializeHighlights = deserializeHighlights;
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
var getHighlights = function (el, params) {
    if (!params)
        params = new TextHighlighterUtils_1.paramsImp();
    params = TextHighlighterUtils_1.defaults(params, {
        container: el,
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
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
var serializeHighlights = function (el) {
    if (!el)
        return;
    var highlights = getHighlights(el), refEl = el, hlDescriptors = [];
    if (!highlights)
        return;
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
            var color = "";
            if (wrapper instanceof HTMLElement) {
                var c = wrapper.getAttribute("data-backgroundcolor");
                if (c)
                    color = c.trim();
                wrapper.innerHTML = "";
                wrapper = wrapper.outerHTML;
            }
            if (highlight.previousSibling &&
                highlight.previousSibling.nodeType === TextHighlighterUtils_1.NODE_TYPE.TEXT_NODE &&
                highlight.previousSibling instanceof Text) {
                offset = highlight.previousSibling.length;
            }
            var hl = {
                wrapper: wrapper,
                textContent: highlight.textContent,
                path: hlPath.join(":"),
                color: color,
                offset: offset,
                length: length_1
            };
            hlDescriptors.push(hl);
        }
    });
    return JSON.stringify(hlDescriptors);
};
exports.serializeHighlights = serializeHighlights;
var removeHighlights = function (element, options) {
    var container = element, highlights = getHighlights(element, { container: container });
    // self = this;
    if (!highlights)
        return;
    if (!options)
        options = new TextHighlighterUtils_1.optionsImpl();
    options = TextHighlighterUtils_1.defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRemoveHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onBeforeHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return true;
        }
    });
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
        if (!highlight)
            return;
        var textNodes = TextHighlighterUtils_1.dom(highlight).unwrap();
        if (textNodes)
            textNodes.forEach(function (node) {
                mergeSiblingTextNodes(node);
            });
    }
    TextHighlighterUtils_1.sortByDepth(highlights, true);
    highlights.forEach(function (hl) {
        if (options &&
            options.onRemoveHighlight &&
            options.onRemoveHighlight(hl) === true) {
            removeHighlight(hl);
        }
    });
};
exports.removeHighlights = removeHighlights;

},{"./TextHighlighterUtils":2}]},{},[1]);
