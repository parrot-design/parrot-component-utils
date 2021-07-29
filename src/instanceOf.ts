import getWindow from "./getWindow";

export function isElement(node:any):boolean{
    const OwnElement = getWindow(node).Element;
    return node instanceof OwnElement ||node instanceof Element;
}