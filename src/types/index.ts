export interface TextHighlighterType {
    doHighlight: any;
    deserializeHighlights: any;
    serializeHighlights: any;
    removeHighlights: any;
    optionsImpl: any;
}

export interface TextRange {
    collapse(arg0: boolean): any;
    select(): void;
    parentElement(): any;
    findText(text: any, arg1: number, arg2: number): any;
    moveToElementText(el: any): any;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class highlightI {
    highlightHandler: any;
    options: optionsImpl | undefined;
    el: HTMLElement | undefined;
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface optionsI {
    color?: string;
    highlightedClass?: string;
    contextClass?: string;
    onRemoveHighlight?: { (...e: any[]): boolean };
    onBeforeHighlight?: { (...e: any[]): boolean };
    onAfterHighlight?: { (...e: any[]): boolean };
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class optionsImpl implements optionsI {
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
export class paramsImp {
    container?: HTMLElement;
    andSelf?: boolean;
    grouped?: any;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface hlDescriptorI {
    wrapper: string;
    textContent: string;
    color: string;
    hlpaths?: number[];
    path: string;
    offset: number;
    length: number;
}