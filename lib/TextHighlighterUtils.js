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
            return refEl.parentNode.insertBefore(el, refEl);
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
                nodes.forEach(function (node) {
                    wrapper_1 = node.parentNode;
                    dom(node).insertBefore(node.parentNode);
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
