// highlight extensions
// eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
type H_HTMLElement = HTMLElement;
// eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
interface ie_HTMLElement extends HTMLElement {
  createTextRange(): TextRange;
}

interface TextRange {
  collapse(arg0: boolean): any;
  select(): void;
  parentElement(): any;
  findText(text: any, arg1: number, arg2: number): any;
  moveToElementText(el: any): any;
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
// interface H_Node extends Node {
//   splitText(endOffset: number): any;
// }
// eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
interface H_Window extends Window {
  find(text: any, caseSens: any): boolean;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class highlightI {
  highlightHandler: any;
  options: optionsImpl | undefined;
  el: HTMLElement | undefined;
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
interface optionsI {
  color?: string;
  highlightedClass?: string;
  contextClass?: string;
  onRemoveHighlight?: { (...e: any[]): boolean };
  onBeforeHighlight?: { (...e: any[]): boolean };
  onAfterHighlight?: { (...e: any[]): boolean };
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
class optionsImpl implements optionsI {
  color?: string | undefined;
  highlightedClass?: string | undefined;
  contextClass?: string | undefined;
  onRemoveHighlight?: { (...e: any[]): boolean };
  onBeforeHighlight?: { (...e: any[]): boolean };
  onAfterHighlight?: { (...e: any[]): boolean };
  //   constructor() {}
}

// class containerI{
//     querySelectorAll: (arg0: string): any;
//     hasAttribute: (arg0: string) => any;
// }
// eslint-disable-next-line @typescript-eslint/class-name-casing
class paramsImp {
  container?: HTMLElement;
  andSelf?: boolean;
  grouped?: any;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface hlDescriptorI {
  wrapper: string;
  textContent: string;
  hlpaths?: number[];
  path: string;
  offset: number;
  length: number;
}

const /**
   * Attribute added by default to every highlight.
   * @type {string}
   */
  DATA_ATTR = "data-highlighted",
  /**
   * Attribute used to group highlight wrappers.
   * @type {string}
   */
  TIMESTAMP_ATTR = "data-timestamp",
  NODE_TYPE = {
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

function activator<T>(type: { new (): T }): T {
  return new type();
}

/**
 * Groups given highlights by timestamp.
 * @param {Array} highlights
 * @returns {Array} Grouped highlights.
 */
function groupHighlights(highlights: any) {
  const order: any = [],
    chunks: any = {},
    grouped: any = [];

  highlights.forEach(function(hl: any) {
    const timestamp = hl.getAttribute(TIMESTAMP_ATTR);

    if (typeof chunks[timestamp] === "undefined") {
      chunks[timestamp] = [];
      order.push(timestamp);
    }

    chunks[timestamp].push(hl);
  });

  order.forEach(function(timestamp: any) {
    const group = chunks[timestamp];

    grouped.push({
      chunks: group,
      timestamp: timestamp,
      toString: function() {
        return group
          .map(function(h: { textContent: any }) {
            return h.textContent;
          })
          .join("");
      }
    });
  });

  return grouped;
}

/**
 * Fills undefined values in obj with default properties with the same name from source object.
 * @param {object} obj - target object, can't be null, must be initialized first
 * @param {object} source - source object with default values
 * @returns {object}
 */
function defaults<T>(obj: T, source: T): T {
  for (const prop in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, prop) &&
      obj[prop] === void 0
    ) {
      obj[prop] = source[prop];
    }
  }

  return obj;
}

/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr: any) {
  return arr.filter(function(value: any, idx: any, self: string | any[]) {
    return self.indexOf(value) === idx;
  });
}

/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range: Range) {
  let startContainer:
      | Node
      | (Node & ParentNode)
      | null = range.startContainer as HTMLElement,
    endContainer: Node | (Node & ParentNode) | null = range.endContainer,
    goDeeper = true;
  const ancestor = range.commonAncestorContainer;

  if (range.endOffset === 0) {
    while (
      endContainer &&
      !endContainer.previousSibling &&
      endContainer.parentNode !== ancestor
    ) {
      endContainer = endContainer.parentNode;
    }
    if (endContainer) endContainer = endContainer.previousSibling;
  } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (
      endContainer &&
      endContainer.nodeValue &&
      range.endOffset < endContainer.nodeValue.length
    ) {
      const t = endContainer as Text;
      t.splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }

  if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (
      startContainer &&
      startContainer.nodeValue &&
      range.startOffset === startContainer.nodeValue.length
    ) {
      goDeeper = false;
    } else if (startContainer instanceof Node && range.startOffset > 0) {
      const t = startContainer as Text;
      startContainer = t.splitText(range.startOffset);
      if (startContainer && endContainer === startContainer.previousSibling) {
        endContainer = startContainer;
      }
    }
  } else if (range.startOffset < startContainer.childNodes.length) {
    startContainer = startContainer.childNodes.item(range.startOffset);
  } else {
    startContainer = startContainer.nextSibling;
  }

  return {
    startContainer: startContainer,
    endContainer: endContainer,
    goDeeper: goDeeper
  };
}

/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 */
const dom = function(el: Node | HTMLElement | null | undefined) {
  return /** @lends dom **/ {
    /**
     * Adds class to element.
     * @param {string} className
     */
    addClass: function(className: string) {
      if (el instanceof HTMLElement)
        if (el.classList) {
          el.classList.add(className);
        } else {
          el.className += " " + className;
        }
    },

    /**
     * Removes class from element.
     * @param {string} className
     */
    removeClass: function(className: string) {
      if (el instanceof HTMLElement) {
        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(
            new RegExp("(^|\\b)" + className + "(\\b|$)", "gi"),
            " "
          );
        }
      }
    },

    /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
    prepend: function(nodesToPrepend: any) {
      const nodes = Array.prototype.slice.call(nodesToPrepend);
      let i = nodes.length;

      if (el)
        while (i--) {
          el.insertBefore(nodes[i], el.firstChild);
        }
    },

    /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
    append: function(nodesToAppend: any) {
      if (el) {
        const nodes = Array.prototype.slice.call(nodesToAppend);

        for (let i = 0, len = nodes.length; i < len; ++i) {
          el.appendChild(nodes[i]);
        }
      }
    },

    /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertAfter: function(refEl: {
      parentNode: { insertBefore: (arg0: any, arg1: any) => any };
      nextSibling: any;
    }) {
      return refEl.parentNode.insertBefore(el, refEl.nextSibling);
    },

    /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertBefore: function(refEl: {
      parentNode: { insertBefore: (arg0: any, arg1: any) => any };
    }) {
      return refEl.parentNode.insertBefore(el, refEl);
    },

    /**
     * Removes base element from DOM.
     */
    remove: function() {
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
    contains: function(child: any) {
      return el && el !== child && el.contains(child);
    },

    /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
    wrap: function(wrapper: HTMLElement) {
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
    unwrap: function() {
      if (el) {
        const nodes = Array.prototype.slice.call(el.childNodes);
        let wrapper;

        nodes.forEach(function(node) {
          wrapper = node.parentNode;
          dom(node).insertBefore(node.parentNode);
          dom(wrapper).remove();
        });

        return nodes;
      }
    },

    /**
     * Returns array of base element parents.
     * @returns {HTMLElement[]}
     */
    parents: function() {
      let parent;
      const path = [];
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
    normalizeTextNodes: function() {
      if (!el) {
        return;
      }

      if (
        el.nodeType === NODE_TYPE.TEXT_NODE &&
        el.nodeValue &&
        el.parentNode
      ) {
        while (
          el.nextSibling &&
          el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE
        ) {
          el.nodeValue += el.nextSibling.nodeValue;
          el.parentNode.removeChild(el.nextSibling);
        }
      } else {
        dom(el.firstChild).normalizeTextNodes();
      }
      dom(el.nextSibling).normalizeTextNodes();
    },

    /**
     * Returns element background color.
     * @returns {CSSStyleDeclaration.backgroundColor}
     */
    color: function() {
      return el instanceof HTMLElement && el.style
        ? el.style.backgroundColor
        : null;
    },

    /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
    fromHTML: function(html: string) {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.childNodes;
    },

    /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
    getRange: function() {
      const selection = dom(el).getSelection();
      let range;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      return range;
    },

    /**
     * Removes all ranges of the window of base element.
     */
    removeAllRanges: function() {
      const selection = dom(el).getSelection();
      if (selection) selection.removeAllRanges();
    },

    /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
    getSelection: function() {
      const win = dom(el).getWindow();
      return win ? win.getSelection() : null;
    },

    /**
     * Returns window of the base element.
     * @returns {Window}
     */
    getWindow: function() {
      const doc = dom(el).getDocument() as Document;
      return doc instanceof Document ? doc.defaultView : null;
    },

    /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
    getDocument: function() {
      // if ownerDocument is null then el is the document itself.
      if (el) return el.ownerDocument || el;
    }
  };
};

/**
 * Returns true if elements a i b have the same color.
 * @param {Node} a
 * @param {Node} b
 * @returns {boolean}
 */
function haveSameColor(a: Node, b: Node) {
  return dom(a).color() === dom(b).color();
}

/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
function sortByDepth(arr: any, descending: any) {
  arr.sort(function(a: any, b: any) {
    return (
      dom(descending ? b : a).parents().length -
      dom(descending ? a : b).parents().length
    );
  });
}


export {
  DATA_ATTR,
  TIMESTAMP_ATTR,
  NODE_TYPE,
  IGNORE_TAGS,
  dom,
  refineRangeBoundaries,
  sortByDepth,
  unique,
  haveSameColor,
  optionsI,
  highlightI,
  // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  H_Window,
  //   H_Node,
  // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  ie_HTMLElement,
  TextRange,
  defaults,
  groupHighlights,
  activator,
  optionsImpl,
  paramsImp,
  hlDescriptorI
};
