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
interface H_Window extends Window {
    find(text: any, caseSens: any): boolean;
}
declare class highlightI {
    highlightHandler: any;
    options: optionsImpl | undefined;
    el: HTMLElement | undefined;
}
interface optionsI {
    color?: string;
    highlightedClass?: string;
    contextClass?: string;
    onRemoveHighlight?: {
        (...e: any[]): boolean;
    };
    onBeforeHighlight?: {
        (...e: any[]): boolean;
    };
    onAfterHighlight?: {
        (...e: any[]): boolean;
    };
}
declare class optionsImpl implements optionsI {
    color?: string | undefined;
    highlightedClass?: string | undefined;
    contextClass?: string | undefined;
    onRemoveHighlight?: {
        (...e: any[]): boolean;
    };
    onBeforeHighlight?: {
        (...e: any[]): boolean;
    };
    onAfterHighlight?: {
        (...e: any[]): boolean;
    };
}
declare class paramsImp {
    container?: HTMLElement;
    andSelf?: boolean;
    grouped?: any;
}
interface hlDescriptorI {
    wrapper: string;
    textContent: string;
    color: string;
    hlpaths?: number[];
    path: string;
    offset: number;
    length: number;
}
declare const /**
   * Attribute added by default to every highlight.
   * @type {string}
   */ DATA_ATTR = "data-highlighted", 
/**
 * Attribute used to group highlight wrappers.
 * @type {string}
 */
TIMESTAMP_ATTR = "data-timestamp", NODE_TYPE: {
    ELEMENT_NODE: number;
    TEXT_NODE: number;
}, 
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */
IGNORE_TAGS: string[];
declare function activator<T>(type: {
    new (): T;
}): T;
/**
 * Groups given highlights by timestamp.
 * @param {Array} highlights
 * @returns {Array} Grouped highlights.
 */
declare function groupHighlights(highlights: any): any;
/**
 * Fills undefined values in obj with default properties with the same name from source object.
 * @param {object} obj - target object, can't be null, must be initialized first
 * @param {object} source - source object with default values
 * @returns {object}
 */
declare function defaults<T>(obj: T, source: T): T;
/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
declare function unique(arr: any): any;
/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
declare function refineRangeBoundaries(range: Range): {
    startContainer: Node | (Node & ParentNode) | null;
    endContainer: Node | null;
    goDeeper: boolean;
};
/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 */
declare const dom: (el: Node | HTMLElement | null | undefined) => {
    /**
     * Adds class to element.
     * @param {string} className
     */
    addClass: (className: string) => void;
    /**
     * Removes class from element.
     * @param {string} className
     */
    removeClass: (className: string) => void;
    /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
    prepend: (nodesToPrepend: any) => void;
    /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
    append: (nodesToAppend: any) => void;
    /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertAfter: (refEl: {
        parentNode: {
            insertBefore: (arg0: any, arg1: any) => any;
        };
        nextSibling: any;
    }) => any;
    /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertBefore: (refEl: {
        parentNode: {
            insertBefore: (arg0: any, arg1: any) => any;
        };
    }) => any;
    /**
     * Removes base element from DOM.
     */
    remove: () => void;
    /**
     * Returns true if base element contains given child.
     * @param {Node|HTMLElement} child
     * @returns {boolean}
     */
    contains: (child: any) => boolean | null | undefined;
    /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
    wrap: (wrapper: HTMLElement) => HTMLElement;
    /**
     * Unwraps base element.
     * @returns {Node[]} - child nodes of unwrapped element.
     */
    unwrap: () => any[] | undefined;
    /**
     * Returns array of base element parents.
     * @returns {HTMLElement[]}
     */
    parents: () => (Node & ParentNode)[];
    /**
     * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
     * element node has only one text node.
     * It should does the same as standard element.normalize, but IE implements it incorrectly.
     */
    normalizeTextNodes: () => void;
    /**
     * Returns element background color.
     * @returns {CSSStyleDeclaration.backgroundColor}
     */
    color: () => string | null;
    /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
    fromHTML: (html: string) => NodeListOf<ChildNode>;
    /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
    getRange: () => Range | undefined;
    /**
     * Removes all ranges of the window of base element.
     */
    removeAllRanges: () => void;
    /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
    getSelection: () => Selection | null;
    /**
     * Returns window of the base element.
     * @returns {Window}
     */
    getWindow: () => (Window & typeof globalThis) | null;
    /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
    getDocument: () => Node | undefined;
};
/**
 * Returns true if elements a i b have the same color.
 * @param {Node} a
 * @param {Node} b
 * @returns {boolean}
 */
declare function haveSameColor(a: Node, b: Node): boolean;
/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
declare function sortByDepth(arr: any, descending: any): void;
export { DATA_ATTR, TIMESTAMP_ATTR, NODE_TYPE, IGNORE_TAGS, dom, refineRangeBoundaries, sortByDepth, unique, haveSameColor, optionsI, highlightI, H_Window, ie_HTMLElement, TextRange, defaults, groupHighlights, activator, optionsImpl, paramsImp, hlDescriptorI };
