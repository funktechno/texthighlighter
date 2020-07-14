// TextHighLighterv2
// Port by: lastlink <https://github.com/lastlink/>
import {
    TIMESTAMP_ATTR,
    IGNORE_TAGS,
    NODE_TYPE,
    DATA_ATTR,
    dom,
    refineRangeBoundaries,
    sortByDepth,
    unique,
    haveSameColor,
    optionsImpl,
    paramsImp,
    hlDescriptorI,
    defaults,
    groupHighlights
} from "./TextHighlighterUtils";

/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 * @memberof TextHighlighter
 * @static
 */
function createWrapper(options: optionsImpl) {
    const span = document.createElement("span");
    if (options.color) {
        span.style.backgroundColor = options.color;
        span.setAttribute("data-backgroundcolor", options.color);
    }
    if (options.highlightedClass) span.className = options.highlightedClass;
    return span;
}

/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 * @memberof TextHighlighter
 */
const highlightRange = function (
    el: HTMLElement,
    range: Range,
    wrapper: { cloneNode: (arg0: boolean) => any }
): HTMLElement[] {
    if (!range || range.collapsed) {
        return [];
    }

    const result = refineRangeBoundaries(range);
    const startContainer = result.startContainer,
        endContainer = result.endContainer,
        highlights = [];

    let goDeeper = result.goDeeper,
        done = false,
        node = startContainer,
        highlight,
        wrapperClone,
        nodeParent;

    do {
        if (node && goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {
            if (
                node.parentNode instanceof HTMLElement &&
                node.parentNode.tagName &&
                node.nodeValue &&
                IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 &&
                node.nodeValue.trim() !== ""
            ) {
                wrapperClone = wrapper.cloneNode(true);
                wrapperClone.setAttribute(DATA_ATTR, true);
                nodeParent = node.parentNode;

                // highlight if a node is inside the el
                if (dom(el).contains(nodeParent) || nodeParent === el) {
                    highlight = dom(node).wrap(wrapperClone);
                    highlights.push(highlight);
                }
            }

            goDeeper = false;
        }
        if (
            node === endContainer &&
            endContainer &&
            !(endContainer.hasChildNodes() && goDeeper)
        ) {
            done = true;
        }

        if (
            node instanceof HTMLElement &&
            node.tagName &&
            IGNORE_TAGS.indexOf(node.tagName) > -1
        ) {
            if (
                endContainer instanceof HTMLElement &&
                endContainer.parentNode === node
            ) {
                done = true;
            }
            goDeeper = false;
        }
        if (
            goDeeper &&
            (node instanceof Text || node instanceof HTMLElement) &&
            node.hasChildNodes()
        ) {
            node = node.firstChild;
        } else if (node && node.nextSibling) {
            node = node.nextSibling;
            goDeeper = true;
        } else if (node) {
            node = node.parentNode;
            goDeeper = false;
        }
    } while (!done);

    return highlights;
};

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
const isHighlight = function (el: HTMLElement) {
    return (
        el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR)
    );
};
/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 * @memberof TextHighlighter
 */
const flattenNestedHighlights = function (highlights: any[]) {
    let again;
    // self = this;

    sortByDepth(highlights, true);

    const flattenOnce = () => {
        let again = false;

        highlights.forEach((hl: Node, i: number | number) => {
            const parent = hl.parentElement;
            if (parent) {
                const parentPrev = parent.previousSibling,
                    parentNext = parent.nextSibling;

                if (isHighlight(parent)) {
                    if (!haveSameColor(parent, hl)) {
                        if (!hl.nextSibling && parentNext && parent) {
                            const newLocal: any = parentNext || parent;
                            if (newLocal) {
                                dom(hl).insertBefore(newLocal);
                                again = true;
                            }
                        }

                        if (!hl.previousSibling) {
                            const newLocal: any = parentPrev || parent;
                            if (newLocal) {
                                dom(hl).insertAfter(newLocal);
                                again = true;
                            }
                        }

                        if (!parent.hasChildNodes()) {
                            dom(parent).remove();
                        }
                    } else {
                        if (hl && hl.firstChild) parent.replaceChild(hl.firstChild, hl);
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
const mergeSiblingHighlights = function (highlights: any[]) {
    //   const self = this;

    const shouldMerge = (current: Node, node: Node) => {
        return (
            node &&
            node.nodeType === NODE_TYPE.ELEMENT_NODE &&
            haveSameColor(current, node) &&
            isHighlight(node as HTMLElement)
        );
    };
    //   : {
    //     previousSibling: any;
    //     nextSibling: any;
    //   }
    highlights.forEach(function (highlight: any) {
        const prev = highlight.previousSibling,
            next = highlight.nextSibling;

        if (shouldMerge(highlight, prev)) {
            dom(highlight).prepend(prev.childNodes);
            dom(prev).remove();
        }
        if (shouldMerge(highlight, next)) {
            dom(highlight).append(next.childNodes);
            dom(next).remove();
        }

        dom(highlight).normalizeTextNodes();
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
const normalizeHighlights = function (highlights: any[]) {
    let normalizedHighlights;

    flattenNestedHighlights(highlights);
    mergeSiblingHighlights(highlights);

    // omit removed nodes
    normalizedHighlights = highlights.filter(function (hl: {
        parentElement: any;
    }) {
        return hl.parentElement ? hl : null;
    });

    normalizedHighlights = unique(normalizedHighlights);
    normalizedHighlights.sort(function (
        a: { offsetTop: number; offsetLeft: number },
        b: { offsetTop: number; offsetLeft: number }
    ) {
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
const doHighlight = function (
    el: HTMLElement,
    keepRange: boolean,
    options?: optionsImpl
): boolean {
    const range = dom(el).getRange();
    let wrapper, createdHighlights, normalizedHighlights, timestamp: string;
    if (!options) options = new optionsImpl();

    options = defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRemoveHighlight: function (...e: any[]) {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onBeforeHighlight: function (...e: any[]) {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function (...e: any[]) {
            return true;
        }
    });

    if (!range || range.collapsed) {
        return false;
    }
    let highlightMade = false;

    if (options.onBeforeHighlight && options.onBeforeHighlight(range) === true) {
        timestamp = (+new Date()).toString();
        wrapper = createWrapper(options);
        wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);

        createdHighlights = highlightRange(el, range, wrapper);
        if (createdHighlights.length > 0) highlightMade = true;
        normalizedHighlights = normalizeHighlights(createdHighlights);
        if (options.onAfterHighlight)
            options.onAfterHighlight(range, normalizedHighlights, timestamp);
    }

    if (!keepRange) {
        dom(el).removeAllRanges();
    }
    return highlightMade;
};

/**
 * Deserializes highlights.
 * @throws exception when can't parse JSON or JSON has invalid structure.
 * @param {object} json - JSON object with highlights definition.
 * @returns {Array} - array of deserialized highlights.
 * @memberof TextHighlighter
 */
const deserializeHighlights = function (el: HTMLElement, json: string) {
    let hlDescriptors: hlDescriptorI[];
    const highlights: { appendChild: (arg0: any) => void }[] = [];
    //    const self = this;

    if (!json) {
        return highlights;
    }

    try {
        // const r = String.raw`${json}`;
        hlDescriptors = JSON.parse(json);
    } catch (e) {
        throw "Can't parse JSON: " + e;
    }

    function deserializationFn(hlDescriptor: hlDescriptorI) {
        const hl = hlDescriptor;
        hl.hlpaths = hl.path.split(":").map(Number);
        if (!hl.hlpaths || hl.hlpaths.length == 0) return;
        //  {
        //   wrapper: hlDescriptor[0],
        //   text: hlDescriptor[1],
        //   path: hlDescriptor[2].split(":"),
        //   offset: hlDescriptor[3],
        //   length: hlDescriptor[4]
        // };
        let elIndex = hl.hlpaths.pop(),
            node: Node | Text = el as Node,
            highlight,
            idx;

        // should have a value and not be 0 (false is = to 0)
        if (elIndex != 0 && !elIndex) return;

        while (hl.hlpaths.length > 0) {
            idx = hl.hlpaths.shift();
            if (idx || idx == 0)
                node = node.childNodes[idx] as Node;
        }

        if (
            node.childNodes[elIndex - 1] &&
            node.childNodes[elIndex - 1].nodeType === NODE_TYPE.TEXT_NODE
        ) {
            elIndex -= 1;
        }

        node = node.childNodes[elIndex] as Text;
        if (node instanceof Text) {
            const hlNode = node.splitText(hl.offset);
            hlNode.splitText(hl.length);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
                dom(hlNode.nextSibling).remove();
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                dom(hlNode.previousSibling).remove();
            }
            if (hl && hl.wrapper) {
                const tmpHtml = dom(hlNode).fromHTML(hl.wrapper)[0] as HTMLElement;
                if (tmpHtml) {
                    highlight = dom(hlNode).wrap(tmpHtml);
                    highlights.push(highlight);
                }
            }
        }
    }

    hlDescriptors.forEach(function (hlDescriptor: hlDescriptorI) {
        try {
            deserializationFn(hlDescriptor);
        } catch (e) {
            if (console && console.warn) {
                console.warn("Can't deserialize highlight descriptor. Cause: " + e);
            }
        }
    });

    return highlights;
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
const getHighlights = function (el: HTMLElement, params?: paramsImp) {
    if (!params) params = new paramsImp();
    params = defaults(params, {
        container: el,
        andSelf: true,
        grouped: false
    });
    if (params.container) {
        const nodeList = params.container.querySelectorAll("[" + DATA_ATTR + "]");
        let highlights = Array.prototype.slice.call(nodeList);

        if (params.andSelf === true && params.container.hasAttribute(DATA_ATTR)) {
            highlights.push(params.container);
        }

        if (params.grouped) {
            highlights = groupHighlights(highlights);
        }
        return highlights;
    }
};

/**
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
const serializeHighlights = function (el: HTMLElement | null) {
    if (!el) return;
    const highlights = getHighlights(el),
        refEl = el,
        hlDescriptors: hlDescriptorI[] = [];

    if (!highlights) return;

    function getElementPath(
        el: HTMLElement | ParentNode | ChildNode,
        refElement: any
    ) {
        const path = [];
        let childNodes;
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

    sortByDepth(highlights, false);

    //   {
    //     textContent: string | any[];
    //     cloneNode: (arg0: boolean) => any;
    //     previousSibling: { nodeType: number; length: number };
    //   }
    highlights.forEach(function (highlight: HTMLElement) {
        if (highlight && highlight.textContent) {
            let offset = 0, // Hl offset from previous sibling within parent node.
                wrapper = highlight.cloneNode(true) as HTMLElement | string;
            const length = highlight.textContent.length,
                hlPath = getElementPath(highlight, refEl);
            let color = "";
            if (wrapper instanceof HTMLElement) {
                const c = wrapper.getAttribute("data-backgroundcolor");
                if (c) color = c.trim();
                wrapper.innerHTML = "";
                wrapper = wrapper.outerHTML;
            }

            if (
                highlight.previousSibling &&
                highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE &&
                highlight.previousSibling instanceof Text
            ) {
                offset = highlight.previousSibling.length;
            }
            const hl: hlDescriptorI = {
                wrapper,
                textContent: highlight.textContent,
                path: hlPath.join(":"),
                color,
                offset,
                length
            };

            hlDescriptors.push(hl);
        }
    });
    return JSON.stringify(hlDescriptors);
};

const removeHighlights = function (element: HTMLElement, options?: optionsImpl) {
    const container = element,
        highlights = getHighlights(element, { container: container });
    // self = this;
    if (!highlights) return;

    if (!options) options = new optionsImpl();

    options = defaults(options, {
        color: "#ffff7b",
        highlightedClass: "highlighted",
        contextClass: "highlighter-context",

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRemoveHighlight: function (...e: any[]): boolean {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onBeforeHighlight: function (...e: any[]) {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAfterHighlight: function (...e: any[]) {
            return true;
        }
    });

    function mergeSiblingTextNodes(textNode: {
        previousSibling: any;
        nextSibling: any;
        nodeValue: any;
    }) {
        const prev = textNode.previousSibling,
            next = textNode.nextSibling;

        if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
            dom(prev).remove();
        }
        if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = textNode.nodeValue + next.nodeValue;
            dom(next).remove();
        }
    }
    function removeHighlight(highlight: any) {
        if (!highlight) return;
        const textNodes = dom(highlight).unwrap();
        if (textNodes)
            textNodes.forEach(function (node) {
                mergeSiblingTextNodes(node);
            });
    }

    sortByDepth(highlights, true);

    highlights.forEach((hl: any) => {
        if (
            options &&
            options.onRemoveHighlight &&
            options.onRemoveHighlight(hl) === true
        ) {
            removeHighlight(hl);
        }
    });
};

export {
    doHighlight,
    deserializeHighlights,
    serializeHighlights,
    removeHighlights,
    optionsImpl,
    createWrapper,
    highlightRange
};
