// (function (global) {
// TextHighlighter (archived)
// original file first converted to typescript that doesn't throw any lint errors. 
// Had issues doing a new class of it so extracted methods and clean functions into utils file
"use strict";
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
  optionsI,
  paramsImp,
  highlightI,
  // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  H_Window,
  // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  ie_HTMLElement,
  TextRange,
  //   optionsImpl,
  //   activator,
  defaults,
  groupHighlights
} from "./TextHighlighterUtils";

// { highlightHandler: { bind: (arg0: any) => any }}
function bindEvents(
  el: { addEventListener: (arg0: string, arg1: any) => void },
  scope: highlightI
) {
  el.addEventListener("mouseup", scope.highlightHandler.bind(scope));
  el.addEventListener("touchend", scope.highlightHandler.bind(scope));
}

function unbindEvents(
  el: { removeEventListener: (arg0: string, arg1: any) => void },
  scope: { highlightHandler: { bind: (arg0: any) => any } }
) {
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
function TextHighlighter(
  this: highlightI,
  element: HTMLElement,
  options?: optionsI
) {
  if (!element) {
    throw "Missing anchor element";
  }

  this.el = element;
  this.options = defaults(options, {
    color: "#ffff7b",
    highlightedClass: "highlighted",
    contextClass: "highlighter-context",
    onRemoveHighlight: function() {
      return true;
    },
    onBeforeHighlight: function() {
      return true;
    },
    onAfterHighlight: function() {
      return true;
    }
  });
  if (this.options?.contextClass)
    dom(this.el).addClass(this.options.contextClass);
  bindEvents(this.el, this);
  return this;
}

/**
 * Permanently disables highlighting.
 * Unbinds events and remove context element class.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.destroy = function() {
  unbindEvents(this.el, this);
  dom(this.el).removeClass(this.options.contextClass);
};

TextHighlighter.prototype.highlightHandler = function() {
  this.doHighlight();
};

/**
 * Highlights current range.
 * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.doHighlight = function(keepRange: any) {
  const range = dom(this.el).getRange();
  let wrapper, createdHighlights, normalizedHighlights, timestamp: string;

  if (!range || range.collapsed) {
    return;
  }

  if (this.options.onBeforeHighlight(range) === true) {
    timestamp = (+new Date()).toString();
    wrapper = TextHighlighter.createWrapper(this.options);
    wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);

    createdHighlights = this.highlightRange(range, wrapper);
    normalizedHighlights = this.normalizeHighlights(createdHighlights);

    this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
  }

  if (!keepRange) {
    dom(this.el).removeAllRanges();
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
TextHighlighter.prototype.highlightRange = function(
  range: Range,
  wrapper: { cloneNode: (arg0: boolean) => any }
) {
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
        if (dom(this.el).contains(nodeParent) || nodeParent === this.el) {
          highlight = dom(node).wrap(wrapperClone);
          highlights.push(highlight);
        }
      }

      goDeeper = false;
    }
    if (
      node === endContainer &&
      endContainer instanceof HTMLElement &&
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
    if (goDeeper && node instanceof HTMLElement && node.hasChildNodes()) {
      node = node.firstChild;
    } else if (node instanceof HTMLElement && node.nextSibling) {
      node = node.nextSibling;
      goDeeper = true;
    } else if (node instanceof HTMLElement) {
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
TextHighlighter.prototype.normalizeHighlights = function(highlights: any[]) {
  let normalizedHighlights;

  this.flattenNestedHighlights(highlights);
  this.mergeSiblingHighlights(highlights);

  // omit removed nodes
  normalizedHighlights = highlights.filter(function(hl: {
    parentElement: any;
  }) {
    return hl.parentElement ? hl : null;
  });

  normalizedHighlights = unique(normalizedHighlights);
  normalizedHighlights.sort(function(
    a: { offsetTop: number; offsetLeft: number },
    b: { offsetTop: number; offsetLeft: number }
  ) {
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
TextHighlighter.prototype.flattenNestedHighlights = function(
  highlights: any[]
) {
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

        if (this.isHighlight(parent)) {
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
TextHighlighter.prototype.mergeSiblingHighlights = function(highlights: any[]) {
  //   const self = this;

  const shouldMerge = (current: Node, node: Node) => {
    return (
      node &&
      node.nodeType === NODE_TYPE.ELEMENT_NODE &&
      haveSameColor(current, node) &&
      this.isHighlight(node)
    );
  };
  //   : {
  //     previousSibling: any;
  //     nextSibling: any;
  //   }
  highlights.forEach(function(highlight: any) {
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
 * Sets highlighting color.
 * @param {string} color - valid CSS color.
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.setColor = function(color: any) {
  this.options.color = color;
};

/**
 * Returns highlighting color.
 * @returns {string}
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.getColor = function() {
  return this.options.color;
};

/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.removeHighlights = function(element: any) {
  const container = element || this.el,
    highlights = this.getHighlights({ container: container });
  // self = this;

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
    const textNodes = dom(highlight).unwrap();
    if (textNodes)
      textNodes.forEach(function(node) {
        mergeSiblingTextNodes(node);
      });
  }

  sortByDepth(highlights, true);

  highlights.forEach((hl: any) => {
    if (this.options.onRemoveHighlight(hl) === true) {
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
TextHighlighter.prototype.getHighlights = function(params: paramsImp) {
  params = defaults(params, {
    container: this.el,
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
 * Returns true if element is a highlight.
 * All highlights have 'data-highlighted' attribute.
 * @param el - element to check.
 * @returns {boolean}
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.isHighlight = function(el: {
  nodeType: number;
  hasAttribute: (arg0: string) => any;
}) {
  return (
    el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR)
  );
};

/**
 * Serializes all highlights in the element the highlighter is applied to.
 * @returns {string} - stringified JSON with highlights definition
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.serializeHighlights = function() {
  const highlights = this.getHighlights(),
    refEl = this.el,
    hlDescriptors: any[][] = [];

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
  highlights.forEach(function(highlight: HTMLElement) {
    if (highlight && highlight.textContent) {
      let offset = 0, // Hl offset from previous sibling within parent node.
        wrapper = highlight.cloneNode(true) as HTMLElement | string;
      const length = highlight.textContent.length,
        hlPath = getElementPath(highlight, refEl);
      if (wrapper instanceof HTMLElement) {
        wrapper.innerHTML = "";
        wrapper = wrapper.outerHTML;
      }

      if (
        highlight.previousSibling &&
        highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE
      ) {
        offset = highlight.previousSibling.childNodes.length;
      }

      hlDescriptors.push([
        wrapper,
        highlight.textContent,
        hlPath.join(":"),
        offset,
        length
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
TextHighlighter.prototype.deserializeHighlights = function(json: string) {
  let hlDescriptors;
  const highlights: { appendChild: (arg0: any) => void }[] = [];
  //    const self = this;

  if (!json) {
    return highlights;
  }

  try {
    hlDescriptors = JSON.parse(json);
  } catch (e) {
    throw "Can't parse JSON: " + e;
  }

  function deserializationFn(this: any, hlDescriptor: any[]) {
    const hl = {
      wrapper: hlDescriptor[0],
      text: hlDescriptor[1],
      path: hlDescriptor[2].split(":"),
      offset: hlDescriptor[3],
      length: hlDescriptor[4]
    };
    let elIndex = hl.path.pop(),
      node = this.el,
      highlight,
      idx;

    while ((idx = hl.path.shift())) {
      node = node.childNodes[idx];
    }

    if (
      node.childNodes[elIndex - 1] &&
      node.childNodes[elIndex - 1].nodeType === NODE_TYPE.TEXT_NODE
    ) {
      elIndex -= 1;
    }

    node = node.childNodes[elIndex];
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

  hlDescriptors.forEach(function(hlDescriptor: any) {
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
 * Finds and highlights given text.
 * @param {string} text - text to search for
 * @param {boolean} [caseSensitive] - if set to true, performs case sensitive search (default: true)
 * @memberof TextHighlighter
 */
TextHighlighter.prototype.find = function(text: any, caseSensitive: any) {
  // eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  const wnd = (dom(this.el).getWindow() as Window) as H_Window,
    scrollX = wnd.scrollX,
    scrollY = wnd.scrollY,
    caseSens = typeof caseSensitive === "undefined" ? true : caseSensitive;

  dom(this.el).removeAllRanges();
// eslint-disable-next-line @typescript-eslint/class-name-casing,@typescript-eslint/camelcase
  const body = wnd.document.body as ie_HTMLElement;

  if (wnd && wnd.find) {
    while (wnd.find(text, caseSens)) {
      this.doHighlight(true);
    }
  } else if (wnd && body && body.createTextRange) {
    const textRange: TextRange = body.createTextRange();
    textRange.moveToElementText(this.el);
    while (textRange.findText(text, 1, caseSens ? 4 : 0)) {
      if (
        !dom(this.el).contains(textRange.parentElement()) &&
        textRange.parentElement() !== this.el
      ) {
        break;
      }

      textRange.select();
      this.doHighlight(true);
      textRange.collapse(false);
    }
  }

  dom(this.el).removeAllRanges();
  if (wnd) wnd.scrollTo(scrollX, scrollY);
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
TextHighlighter.createWrapper = function(options: {
  color: string;
  highlightedClass: string;
}) {
  const span = document.createElement("span");
  span.style.backgroundColor = options.color;
  span.className = options.highlightedClass;
  return span;
};

export { TextHighlighter };
// global.TextHighlighter = TextHighlighter;
// })(window);
