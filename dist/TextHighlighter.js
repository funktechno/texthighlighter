var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("src/TextHighlighterUtils", ["require", "exports"], function (require, exports) {
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
});
define("src/TextHighlighter", ["require", "exports", "src/TextHighlighterUtils"], function (require, exports, TextHighlighterUtils_1) {
    // (function (global) {
    // TextHighlighter (archived, not working)
    // original file first converted to typescript that doesn't throw any lint errors. 
    // Had issues doing a new class of it so extracted methods and clean functions into utils file
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextHighlighter = void 0;
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
});
// global.TextHighlighter = TextHighlighter;
// })(window);
define("src/index", ["require", "exports", "src/TextHighlighterUtils"], function (require, exports, TextHighlighterUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.highlightRange = exports.createWrapper = exports.optionsImpl = exports.removeHighlights = exports.serializeHighlights = exports.deserializeHighlights = exports.doHighlight = void 0;
    Object.defineProperty(exports, "optionsImpl", { enumerable: true, get: function () { return TextHighlighterUtils_2.optionsImpl; } });
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
        var result = TextHighlighterUtils_2.refineRangeBoundaries(range);
        var startContainer = result.startContainer, endContainer = result.endContainer, highlights = [];
        var goDeeper = result.goDeeper, done = false, node = startContainer, highlight, wrapperClone, nodeParent;
        do {
            if (node && goDeeper && node.nodeType === TextHighlighterUtils_2.NODE_TYPE.TEXT_NODE) {
                if (node.parentNode instanceof HTMLElement &&
                    node.parentNode.tagName &&
                    node.nodeValue &&
                    TextHighlighterUtils_2.IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 &&
                    node.nodeValue.trim() !== "") {
                    wrapperClone = wrapper.cloneNode(true);
                    wrapperClone.setAttribute(TextHighlighterUtils_2.DATA_ATTR, true);
                    nodeParent = node.parentNode;
                    // highlight if a node is inside the el
                    if (TextHighlighterUtils_2.dom(el).contains(nodeParent) || nodeParent === el) {
                        highlight = TextHighlighterUtils_2.dom(node).wrap(wrapperClone);
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
                TextHighlighterUtils_2.IGNORE_TAGS.indexOf(node.tagName) > -1) {
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
        return (el && el.nodeType === TextHighlighterUtils_2.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(TextHighlighterUtils_2.DATA_ATTR));
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
        TextHighlighterUtils_2.sortByDepth(highlights, true);
        var flattenOnce = function () {
            var again = false;
            highlights.forEach(function (hl, i) {
                var parent = hl.parentElement;
                if (parent) {
                    var parentPrev = parent.previousSibling, parentNext = parent.nextSibling;
                    if (isHighlight(parent)) {
                        if (!TextHighlighterUtils_2.haveSameColor(parent, hl)) {
                            if (!hl.nextSibling && parentNext && parent) {
                                var newLocal = parentNext || parent;
                                if (newLocal) {
                                    TextHighlighterUtils_2.dom(hl).insertBefore(newLocal);
                                    again = true;
                                }
                            }
                            if (!hl.previousSibling) {
                                var newLocal = parentPrev || parent;
                                if (newLocal) {
                                    TextHighlighterUtils_2.dom(hl).insertAfter(newLocal);
                                    again = true;
                                }
                            }
                            if (!parent.hasChildNodes()) {
                                TextHighlighterUtils_2.dom(parent).remove();
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
                node.nodeType === TextHighlighterUtils_2.NODE_TYPE.ELEMENT_NODE &&
                TextHighlighterUtils_2.haveSameColor(current, node) &&
                isHighlight(node));
        };
        //   : {
        //     previousSibling: any;
        //     nextSibling: any;
        //   }
        highlights.forEach(function (highlight) {
            var prev = highlight.previousSibling, next = highlight.nextSibling;
            if (shouldMerge(highlight, prev)) {
                TextHighlighterUtils_2.dom(highlight).prepend(prev.childNodes);
                TextHighlighterUtils_2.dom(prev).remove();
            }
            if (shouldMerge(highlight, next)) {
                TextHighlighterUtils_2.dom(highlight).append(next.childNodes);
                TextHighlighterUtils_2.dom(next).remove();
            }
            TextHighlighterUtils_2.dom(highlight).normalizeTextNodes();
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
        normalizedHighlights = TextHighlighterUtils_2.unique(normalizedHighlights);
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
        var range = TextHighlighterUtils_2.dom(el).getRange();
        var wrapper, createdHighlights, normalizedHighlights, timestamp;
        if (!options)
            options = new TextHighlighterUtils_2.optionsImpl();
        options = TextHighlighterUtils_2.defaults(options, {
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
            wrapper.setAttribute(TextHighlighterUtils_2.TIMESTAMP_ATTR, timestamp);
            createdHighlights = highlightRange(el, range, wrapper);
            if (createdHighlights.length > 0)
                highlightMade = true;
            normalizedHighlights = normalizeHighlights(createdHighlights);
            if (options.onAfterHighlight)
                options.onAfterHighlight(range, normalizedHighlights, timestamp);
        }
        if (!keepRange) {
            TextHighlighterUtils_2.dom(el).removeAllRanges();
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
                node.childNodes[elIndex - 1].nodeType === TextHighlighterUtils_2.NODE_TYPE.TEXT_NODE) {
                elIndex -= 1;
            }
            node = node.childNodes[elIndex];
            if (node instanceof Text) {
                var hlNode = node.splitText(hl.offset);
                hlNode.splitText(hl.length);
                if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
                    TextHighlighterUtils_2.dom(hlNode.nextSibling).remove();
                }
                if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                    TextHighlighterUtils_2.dom(hlNode.previousSibling).remove();
                }
                if (hl && hl.wrapper) {
                    var tmpHtml = TextHighlighterUtils_2.dom(hlNode).fromHTML(hl.wrapper)[0];
                    if (tmpHtml) {
                        highlight = TextHighlighterUtils_2.dom(hlNode).wrap(tmpHtml);
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
            params = new TextHighlighterUtils_2.paramsImp();
        params = TextHighlighterUtils_2.defaults(params, {
            container: el,
            andSelf: true,
            grouped: false
        });
        if (params.container) {
            var nodeList = params.container.querySelectorAll("[" + TextHighlighterUtils_2.DATA_ATTR + "]");
            var highlights = Array.prototype.slice.call(nodeList);
            if (params.andSelf === true && params.container.hasAttribute(TextHighlighterUtils_2.DATA_ATTR)) {
                highlights.push(params.container);
            }
            if (params.grouped) {
                highlights = TextHighlighterUtils_2.groupHighlights(highlights);
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
        TextHighlighterUtils_2.sortByDepth(highlights, false);
        //   {
        //     textContent: string | any[];
        //     cloneNode: (arg0: boolean) => any;
        //     previousSibling: { nodeType: number; length: number };
        //   }
        highlights.forEach(function (highlight) {
            if (highlight && highlight.textContent) {
                var offset = 0, // Hl offset from previous sibling within parent node.
                wrapper = highlight.cloneNode(true);
                var length_2 = highlight.textContent.length, hlPath = getElementPath(highlight, refEl);
                var color = "";
                if (wrapper instanceof HTMLElement) {
                    var c = wrapper.getAttribute("data-backgroundcolor");
                    if (c)
                        color = c.trim();
                    wrapper.innerHTML = "";
                    wrapper = wrapper.outerHTML;
                }
                if (highlight.previousSibling &&
                    highlight.previousSibling.nodeType === TextHighlighterUtils_2.NODE_TYPE.TEXT_NODE &&
                    highlight.previousSibling instanceof Text) {
                    offset = highlight.previousSibling.length;
                }
                var hl = {
                    wrapper: wrapper,
                    textContent: highlight.textContent,
                    path: hlPath.join(":"),
                    color: color,
                    offset: offset,
                    length: length_2
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
            options = new TextHighlighterUtils_2.optionsImpl();
        options = TextHighlighterUtils_2.defaults(options, {
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
            if (prev && prev.nodeType === TextHighlighterUtils_2.NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
                TextHighlighterUtils_2.dom(prev).remove();
            }
            if (next && next.nodeType === TextHighlighterUtils_2.NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = textNode.nodeValue + next.nodeValue;
                TextHighlighterUtils_2.dom(next).remove();
            }
        }
        function removeHighlight(highlight) {
            if (!highlight)
                return;
            var textNodes = TextHighlighterUtils_2.dom(highlight).unwrap();
            if (textNodes)
                textNodes.forEach(function (node) {
                    mergeSiblingTextNodes(node);
                });
        }
        TextHighlighterUtils_2.sortByDepth(highlights, true);
        highlights.forEach(function (hl) {
            if (options &&
                options.onRemoveHighlight &&
                options.onRemoveHighlight(hl) === true) {
                removeHighlight(hl);
            }
        });
    };
    exports.removeHighlights = removeHighlights;
});
define("tests/utils/helper", ["require", "exports", "fs"], function (require, exports, fs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateExpected = exports.getExpected = exports.getExpectedDict = void 0;
    // const fs = require("fs");
    var path = require("path");
    var base_DIR = path.join(__dirname, "../data/results");
    function getExpectedDict(testData) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, expectedResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path.join(base_DIR, testData + ".json");
                        console.log(filePath);
                        return [4 /*yield*/, fs.existsSync(filePath)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, JSON.parse(fs.readFileSync(filePath, "utf8"))];
                    case 2:
                        expectedResults = _a.sent();
                        return [2 /*return*/, expectedResults];
                    case 3: return [2 /*return*/, {}];
                }
            });
        });
    }
    exports.getExpectedDict = getExpectedDict;
    function getExpected(testData, key) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getExpectedDict(testData)];
                    case 1:
                        expectedResults = _a.sent();
                        if (expectedResults[key]) {
                            return [2 /*return*/, expectedResults[key]];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.getExpected = getExpected;
    function updateExpected(testData, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedResults, filePath, stringResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getExpectedDict(testData)];
                    case 1:
                        expectedResults = _a.sent();
                        expectedResults[key] = result;
                        filePath = path.join(base_DIR, testData + ".json");
                        stringResults = JSON.stringify(expectedResults, null, 4);
                        return [4 /*yield*/, fs.writeFileSync(filePath, stringResults)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateExpected = updateExpected;
});
define("tests/index.spec", ["require", "exports", "src/index", "tests/utils/helper"], function (require, exports, index_1, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataSource = "doHighlight";
    describe("doHighlight", function () {
        test("mock test", function () { return __awaiter(void 0, void 0, void 0, function () {
            var domEle, result, dataKey, expectedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(true).toBe(true); // Set up our document body
                        document.body.innerHTML =
                            "<div id=\"sandbox\">" +
                                "<h1>Lorem ipsum</h1>\n      <p>\n          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus malesuada sagittis. Morbi\n          purus odio, blandit ac urna sed, <b>interdum pharetra</b> leo. Cras congue id est sit amet mattis.\n          Sed in metus et orci eleifend commodo. Phasellus at odio imperdiet, efficitur augue in, pulvinar\n          sapien. Pellentesque leo nulla, porta non lectus eu, ullamcorper semper est. Nunc <i>convallis</i>\n          risus vel mauris accumsan, in rutrum odio sodales. Vestibulum <b>ante ipsum</b> primis in faucibus\n          orci luctus et ultrices posuere cubilia Curae; Sed at tempus mauris. Fusce blandit felis sit amet\n          magna lacinia blandit.\n      </p>\n      <img class=\"shadow\" src=\"assets/img.jpg\" />\n      <p>\n          Maecenas faucibus hendrerit lectus, in auctor felis tristique at. Pellentesque a felis ut nibh\n          malesuada auctor. Ut <b>egestas elit</b> ac ultrices ullamcorper. Pellentesque enim est, varius\n          ultrices velit eget, consectetur aliquam tortor. Aliquam sit amet nibh id tellus sollicitudin\n          faucibus. Nunc euismod augue tempus, ornare justo interdum, consectetur lacus. Pellentesque a\n          molestie tellus, eget convallis lectus.\n      </p>\n      <p>\n          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nunc sed risus blandit convallis\n          id id risus. Morbi tortor metus, imperdiet sed ipsum quis, condimentum mattis tellus. Fusce orci nisi,\n          ultricies vel hendrerit id, egestas id turpis. Proin cursus diam tortor, sed ullamcorper eros commodo\n          vitae. Aenean et maximus sapien. Nam felis velit, ullamcorper eu turpis ut, hendrerit accumsan augue.\n          Nulla et purus sem. Ut at hendrerit purus. <b>Phasellus mollis commodo</b> ante eu mollis. In nec\n          dui vel mauris lacinia vulputate id nec turpis. Aliquam vestibulum, elit sit amet fringilla\n          malesuada, quam nunc eleifend nunc, id iaculis est neque pretium libero.\n      </p>" +
                                "</div>";
                        domEle = document.getElementById("sandbox");
                        result = index_1.serializeHighlights(domEle);
                        dataKey = "emptyHighlights";
                        return [4 /*yield*/, helper_1.getExpected(dataSource, dataKey)];
                    case 1:
                        expectedResult = _a.sent();
                        if (!(result != expectedResult)) return [3 /*break*/, 3];
                        return [4 /*yield*/, helper_1.updateExpected(dataSource, dataKey, result)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        // console.log(result);
                        expect(result).toBe(expectedResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
