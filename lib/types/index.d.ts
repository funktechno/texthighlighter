export interface TextHighlighterI {
    doHighlight: any;
    deserializeHighlights: any;
    serializeHighlights: any;
    removeHighlights: any;
    optionsImpl: any;
}
export interface TextHighlighterSelf {
    el?: HTMLElement;
    options?: optionsImpl;
}
export declare type TextHighlighterType = (element: HTMLElement, options: optionsImpl) => void;
export interface TextRange {
    collapse(arg0: boolean): any;
    select(): void;
    parentElement(): any;
    findText(text: any, arg1: number, arg2: number): any;
    moveToElementText(el: any): any;
}
export declare class highlightI {
    highlightHandler: any;
    options: optionsImpl | undefined;
    el: HTMLElement | undefined;
}
export interface optionsI {
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
export declare class optionsImpl implements optionsI {
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
export declare class paramsImp {
    container?: HTMLElement;
    andSelf?: boolean;
    grouped?: any;
}
export interface hlDescriptorI {
    wrapper: string;
    textContent: string;
    color: string;
    hlpaths?: number[];
    path: string;
    offset: number;
    length: number;
}
